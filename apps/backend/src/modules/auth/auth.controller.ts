import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Verify2FaDto } from './dto/verify-2fa.dto';
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send 6-digit OTP code to phone number via SMS' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }

  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify 6-digit OTP code sent to phone number' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new Customer or Service Provider' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user with Email & Password (+ Optional 2FA)' })
  @ApiResponse({ status: 200, description: 'Authentication successful' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('2fa/setup')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate 2FA TOTP secret & QR Code' })
  async setup2FA(@CurrentUser('id') userId: string) {
    return this.authService.generate2FaSecret(userId);
  }

  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enable 2FA by verifying TOTP code' })
  async enable2FA(@CurrentUser('id') userId: string, @Body() dto: Verify2FaDto) {
    return this.authService.enable2Fa(userId, dto.code);
  }
}
