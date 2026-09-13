import { IsNotEmpty, IsString, IsPhoneNumber, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ example: '+923001234567', description: 'Pakistani Phone Number (+92...)' })
  @IsNotEmpty()
  @IsString()
  phone: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: '+923001234567' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: '849201', description: '6-digit OTP code' })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6, { message: 'OTP code must be exactly 6 digits' })
  code: string;
}
