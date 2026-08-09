import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateCarDto {
  @ApiProperty({ example: 'ABC-1234' })
  @IsString()
  @IsNotEmpty()
  plateNumber: string;

  @ApiProperty({ example: 'Nissan' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: 'Sunny' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: 2019 })
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  year: number;

  @ApiPropertyOptional({ example: 100000 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  currentKm?: number;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  photoPath?: any;
}
