import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';

export class InitiatePaymentDto {
  @ApiProperty({ example: 'booking_uuid_here' })
  @IsString()
  @IsNotEmpty()
  bookingId!: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.STRIPE })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  method!: PaymentMethod;
}
