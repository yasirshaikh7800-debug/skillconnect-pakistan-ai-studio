const fs = require('fs');
const content = fs.readFileSync('apps/backend/src/modules/auth/auth.service.ts', 'utf8');
const search = `  async sendOtp(dto: SendOtpDto) {
    const formattedPhone = dto.phone.trim();
    if (!formattedPhone || formattedPhone.length < 10) {
      throw new BadRequestException('Valid phone number is required');
    }

    const now = Date.now();
    const existing = this.otpStore.get(formattedPhone);

    // Rate Limit: Must wait 60 seconds between resend requests
    if (existing && now - existing.lastSentAt < 60000) {
      const waitTime = Math.ceil((60000 - (now - existing.lastSentAt)) / 1000);
      throw new HttpException(
        \`Please wait \${waitTime} seconds before requesting a new verification code.\`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Generate secure cryptographically random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = now + 5 * 60 * 1000; // 5 minutes expiration

    this.otpStore.set(formattedPhone, {
      phone: formattedPhone,
      code,
      expiresAt,
      attempts: 0,
      lastSentAt: now,
    });

    this.logger.log(\`[OTP SENT] Sent verification code to \${formattedPhone}\`);

    return {
      success: true,
      message: 'OTP verification code sent successfully via SMS',
      phone: formattedPhone,
      expiresInSeconds: 300,
      resendAvailableInSeconds: 60,
    };
  }`;

const replacement = `  async sendOtp(dto: SendOtpDto) {
    const formattedPhone = dto.phone.trim();
    if (!formattedPhone || formattedPhone.length < 10) {
      throw new BadRequestException('Valid phone number is required');
    }

    const now = new Date();
    const existing = await this.prisma.otpVerification.findFirst({
      where: { phone: formattedPhone, isConsumed: false },
      orderBy: { createdAt: 'desc' },
    });

    // Rate Limit: Must wait 60 seconds between resend requests
    if (existing && existing.createdAt.getTime() > now.getTime() - 60000) {
      const waitTime = Math.ceil((60000 - (now.getTime() - existing.createdAt.getTime())) / 1000);
      throw new HttpException(
        \`Please wait \${waitTime} seconds before requesting a new verification code.\`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Generate secure cryptographically random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes expiration

    await this.prisma.otpVerification.create({
      data: {
        phone: formattedPhone,
        codeHash,
        expiresAt,
      },
    });

    this.logger.log(\`[OTP SENT] Sent verification code to \${formattedPhone}\`);

    return {
      success: true,
      message: 'OTP verification code sent successfully via SMS',
      phone: formattedPhone,
      expiresInSeconds: 300,
      resendAvailableInSeconds: 60,
    };
  }`;
fs.writeFileSync('apps/backend/src/modules/auth/auth.service.ts', content.replace(search, replacement));
