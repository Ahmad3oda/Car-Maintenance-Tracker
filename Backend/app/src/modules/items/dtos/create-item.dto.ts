import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  IsDate,
} from 'class-validator';

export class CreateItemDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  carId: number;

  @ApiProperty({ example: 'Brake Pads' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Front ceramic brake pads' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'Bosch' })
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  photoPath?: any;

  @ApiPropertyOptional({ example: '2025-01-15' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  installedDate?: Date;

  @ApiPropertyOptional({ example: 50000 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  installedKm?: number;

  @ApiPropertyOptional({ example: 10000 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  expectedMaintenanceKm?: number;

  @ApiPropertyOptional({ example: 12 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  expectedMaintenanceMonths?: number;
}
