import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FilterServicesDto {
  @ApiPropertyOptional({ example: 'electrical-wiring' })
  @IsOptional()
  @IsString()
  categorySlug?: string;

  @ApiPropertyOptional({ example: 'Karachi' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'wiring' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 24.918 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 67.0971 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ example: 15.0, description: 'Radius in kilometers' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  radiusKm?: number;
}
