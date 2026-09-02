import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
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

  @ApiProperty({ example: '2025-01-15', description: 'Installation date (triggers initial maintenance event)' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  installedDate: Date;

  @ApiPropertyOptional({ example: 50000, description: 'Installation mileage (defaults to current vehicle mileage)' })
  @Transform(({ value }) => (value === '' || value === null || value === 'null' || value === undefined ? null : Number(value)))
  @IsInt()
  @Min(0)
  @IsOptional()
  installedKm?: number | null;

  @ApiPropertyOptional({ example: 10000, description: 'Expected mileage interval for replacement' })
  @Transform(({ value }) => (value === '' || value === null || value === 'null' || value === undefined ? null : Number(value)))
  @IsInt()
  @Min(0)
  @IsOptional()
  expectedMaintenanceKm?: number | null;

  @ApiPropertyOptional({ example: 12, description: 'Expected interval in months for replacement' })
  @Transform(({ value }) => (value === '' || value === null || value === 'null' || value === undefined ? null : Number(value)))
  @IsInt()
  @Min(0)
  @IsOptional()
  expectedMaintenanceMonths?: number | null;
}
