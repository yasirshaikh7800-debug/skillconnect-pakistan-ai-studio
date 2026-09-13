import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'service_uuid_here' })
  @IsString()
  @IsNotEmpty()
  serviceId!: string;

  @ApiProperty({ example: '2026-08-10T10:00:00.000Z', description: 'Scheduled date and time' })
  @IsDateString()
  scheduledAt!: string;

  @ApiProperty({ example: 'House 42-B, Block 6, PECHS, Karachi' })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty({ example: 24.8607 })
  @IsNumber()
  latitude!: number;

  @ApiProperty({ example: 67.0711 })
  @IsNumber()
  longitude!: number;

  @ApiPropertyOptional({ example: 'Please bring an extra 15m copper pipe for inverter installation.' })
  @IsOptional()
  @IsString()
  notes?: string;
}
