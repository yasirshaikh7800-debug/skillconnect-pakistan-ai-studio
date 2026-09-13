import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Verify2FaDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  code!: string;
}
