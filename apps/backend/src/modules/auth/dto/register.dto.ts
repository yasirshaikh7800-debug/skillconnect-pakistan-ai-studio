import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'user@skillconnect.pk' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'SecurePass@123' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: 'Muhammad' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ example: 'Ali' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ example: 'Karachi' })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiPropertyOptional({ example: '+923001234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ enum: UserRole, default: UserRole.CUSTOMER })
  @IsEnum(UserRole)
  role!: UserRole;

  @ApiPropertyOptional({ example: '42101-1234567-1', description: 'Required if role is PROVIDER' })
  @IsOptional()
  @IsString()
  cnicNumber?: string;
}
