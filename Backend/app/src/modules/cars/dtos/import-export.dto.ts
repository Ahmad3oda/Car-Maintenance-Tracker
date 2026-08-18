import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class ImportExtraCostDto {
  @ApiProperty({ example: 'Labor' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 25.0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cost: number;
}

export class ImportMaintenanceRecordDto {
  @ApiProperty({ example: '2025-06-15T00:00:00.000Z' })
  @IsDateString()
  maintenanceDate: string;

  @ApiProperty({ example: 60000 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  kmCounter: number;

  @ApiProperty({ example: 45.0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  itemCost: number;

  @ApiPropertyOptional({ type: [ImportExtraCostDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportExtraCostDto)
  @IsOptional()
  extraCosts?: ImportExtraCostDto[];

  @ApiPropertyOptional({ example: 'Routine filter change' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class ImportItemDto {
  @ApiProperty({ example: 'Engine Oil & Filter' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: '5W-30 Full Synthetic' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'Castrol' })
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @ApiPropertyOptional({ example: '2024-01-15T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  installedDate?: string;

  @ApiPropertyOptional({ example: 40000 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  installedKm?: number;

  @ApiPropertyOptional({ example: 10000 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  expectedMaintenanceKm?: number;

  @ApiPropertyOptional({ example: 6 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  expectedMaintenanceMonths?: number;

  @ApiPropertyOptional({ type: [ImportMaintenanceRecordDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportMaintenanceRecordDto)
  @IsOptional()
  events?: ImportMaintenanceRecordDto[];
}

export class ImportCarDataDto {
  @ApiPropertyOptional({ example: '1.0' })
  @IsString()
  @IsOptional()
  version?: string;

  @ApiProperty({ type: [ImportItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportItemDto)
  items: ImportItemDto[];
}

export class ExportCarSummaryDto {
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  currentKm: number;
}

export class ExportCarDataDto {
  version: string;
  exportedAt: string;
  car: ExportCarSummaryDto;
  items: Array<{
    name: string;
    description?: string | null;
    manufacturer?: string | null;
    installedDate?: Date | string | null;
    installedKm?: number | null;
    expectedMaintenanceKm?: number | null;
    expectedMaintenanceMonths?: number | null;
    events: Array<{
      maintenanceDate: Date | string;
      kmCounter: number;
      itemCost: number;
      extraCosts?: any;
      notes?: string | null;
    }>;
  }>;
}

export class ImportResultDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 3 })
  importedItems: number;

  @ApiProperty({ example: 8 })
  importedEvents: number;

  @ApiProperty({ example: 'Successfully imported 3 items and 8 maintenance records' })
  message: string;
}
