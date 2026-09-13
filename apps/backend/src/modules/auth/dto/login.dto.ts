import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'aisha.khan@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'CustomerPass@123' })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiPropertyOptional({ example: '123456', description: '2FA TOTP code if enabled' })
  @IsOptional()
  @IsString()
  twoFactorCode?: string;
}
