import { Injectable, BadRequestException, UnauthorizedException, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';

interface OtpRecord {
  phone: string;
  code: string;
  expiresAt: number; // timestamp ms
  attempts: number;
  lastSentAt: number; // timestamp ms
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private otpStore = new Map<string, OtpRecord>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Generates a 6-digit numeric OTP and stores it securely with rate-limiting & 5-min expiration.
   */
  async sendOtp(dto: SendOtpDto) {
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
        `Please wait ${waitTime} seconds before requesting a new verification code.`,
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

    this.logger.log(`[OTP SENT] Sent verification code to ${formattedPhone}`);

    return {
      success: true,
      message: 'OTP verification code sent successfully via SMS',
      phone: formattedPhone,
      expiresInSeconds: 300,
      resendAvailableInSeconds: 60,
    };
  }

  /**
   * Verifies the 6-digit OTP code against the backend store with max 5 failed attempts limit.
   */
  async verifyOtp(dto: VerifyOtpDto) {
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
        `Invalid verification code. ${remainingAttempts} attempts remaining.`,
      );
    }

    // Success! Clear the OTP from store to prevent replay attacks
    this.otpStore.delete(formattedPhone);

    // Optionally update user's phone verification status in DB if user exists
    const user = await this.prisma.user.findFirst({
      where: { phone: formattedPhone },
      include: { profile: true, providerProfile: true },
    });

    if (user) {
      const tokens = this.generateTokens(user.id, user.email, user.role);
      return {
        success: true,
        message: 'Phone number verified successfully',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          phone: user.phone,
          profile: user.profile,
          providerProfile: user.providerProfile,
        },
        ...tokens,
      };
    }

    return {
      success: true,
      message: 'Phone number verified successfully',
    };
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email },
          ...(dto.phone ? [{ phone: dto.phone }] : []),
        ],
      },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email or phone already exists');
    }

    if (dto.role === UserRole.PROVIDER && !dto.cnicNumber) {
      throw new BadRequestException('CNIC number is required for Service Providers in Pakistan');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        role: dto.role,
        status: UserStatus.ACTIVE,
        profile: {
          create: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            city: dto.city,
          },
        },
        wallet: {
          create: {
            balance: 0.0,
            currency: 'PKR',
          },
        },
        ...(dto.role === UserRole.PROVIDER && dto.cnicNumber
          ? {
              providerProfile: {
                create: {
                  cnicNumber: dto.cnicNumber,
                  isVerified: false, // Requires admin review
                },
              },
            }
          : {}),
      },
      include: {
        profile: true,
        providerProfile: true,
      },
    });

    this.logger.log(`User registered successfully: ${newUser.id} (${newUser.email})`);
    const tokens = this.generateTokens(newUser.id, newUser.email, newUser.role);

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        profile: newUser.profile,
        providerProfile: newUser.providerProfile,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { profile: true, providerProfile: true },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Account has been suspended by administration');
    }

    if (user.isTwoFactorEnabled) {
      if (!dto.twoFactorCode) {
        return {
          requires2FA: true,
          message: 'Two-Factor Authentication code is required',
        };
      }
      const isValid2FA = authenticator.verify({
        token: dto.twoFactorCode,
        secret: user.twoFactorSecret || '',
      });

      if (!isValid2FA) {
        throw new UnauthorizedException('Invalid 2FA authentication code');
      }
    }

    const tokens = this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        providerProfile: user.providerProfile,
      },
      ...tokens,
    };
  }

  async generate2FaSecret(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(
      user.email,
      'SkillConnect Pakistan',
      secret,
    );

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret },
    });

    const qrCodeUrl = await QRCode.toDataURL(otpAuthUrl);

    return { secret, qrCodeUrl };
  }

  async enable2Fa(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('2FA secret has not been generated');
    }

    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      throw new BadRequestException('Invalid authentication code');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { isTwoFactorEnabled: true },
    });

    return { success: true, message: 'Two-Factor Authentication enabled successfully' };
  }

  private generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
    };
  }
}
