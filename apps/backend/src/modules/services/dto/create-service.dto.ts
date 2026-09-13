import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ example: 'Solar & Inverter Wiring Setup' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Complete wiring setup for hybrid solar inverters and battery bank integration.' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: 3500.0, description: 'Base price in PKR' })
  @IsNumber()
  @Min(0)
  basePrice!: number;

  @ApiPropertyOptional({ example: 120, default: 60 })
  @IsOptional()
  @IsNumber()
  durationMinutes?: number;

  @ApiProperty({ example: 'cat_id_123' })
  @IsString()
  @IsNotEmpty()
  categoryId!: string;
}
