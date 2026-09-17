const fs = require('fs');
const content = fs.readFileSync('apps/backend/src/modules/auth/auth.service.ts', 'utf8');
const search = `  async verifyOtp(dto: VerifyOtpDto) {
    const formattedPhone = dto.phone.trim();
    const userCode = dto.code.trim();
    const now = Date.now();

    const record = this.otpStore.get(formattedPhone);

    if (!record) {
      throw new BadRequestException('No OTP found for this phone number. Please request a new code.');
    }

    // Expiration check
    if (now > record.expiresAt) {
      this.otpStore.delete(formattedPhone);
      throw new BadRequestException('Verification code has expired. Please request a new code.');
    }

    // Rate limiting attempt check (max 5 attempts)
    if (record.attempts >= 5) {
      this.otpStore.delete(formattedPhone);
      throw new HttpException(
        'Too many failed verification attempts. This code is invalidated. Please request a new code.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Code verification check
    if (record.code !== userCode) {
      record.attempts += 1;
      const remainingAttempts = 5 - record.attempts;
      throw new BadRequestException(
        \`Invalid verification code. \${remainingAttempts} attempts remaining.\`,
      );
    }

    // Success! Clear the OTP from store to prevent replay attacks
    this.otpStore.delete(formattedPhone);`;

const replacement = `  async verifyOtp(dto: VerifyOtpDto) {
    const formattedPhone = dto.phone.trim();
    const userCode = dto.code.trim();
    const now = new Date();

    const record = await this.prisma.otpVerification.findFirst({
      where: { phone: formattedPhone, isConsumed: false },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new BadRequestException('No OTP found for this phone number. Please request a new code.');
    }

    // Expiration check
    if (now > record.expiresAt) {
      await this.prisma.otpVerification.update({
        where: { id: record.id },
        data: { isConsumed: true, consumedAt: now },
      });
      throw new BadRequestException('Verification code has expired. Please request a new code.');
    }

    // Rate limiting attempt check (max 5 attempts)
    if (record.attempts >= 5) {
      await this.prisma.otpVerification.update({
        where: { id: record.id },
        data: { isConsumed: true, consumedAt: now },
      });
      throw new HttpException(
        'Too many failed verification attempts. This code is invalidated. Please request a new code.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Code verification check
    const inputHash = crypto.createHash('sha256').update(userCode).digest('hex');
    if (record.codeHash !== inputHash) {
      const newAttempts = record.attempts + 1;
      await this.prisma.otpVerification.update({
        where: { id: record.id },
        data: { attempts: newAttempts },
      });
      const remainingAttempts = 5 - newAttempts;
      throw new BadRequestException(
        \`Invalid verification code. \${remainingAttempts} attempts remaining.\`,
      );
    }

    // Success! Clear the OTP from store to prevent replay attacks
    await this.prisma.otpVerification.update({
      where: { id: record.id },
      data: { isConsumed: true, consumedAt: now },
    });`;
fs.writeFileSync('apps/backend/src/modules/auth/auth.service.ts', content.replace(search, replacement));
