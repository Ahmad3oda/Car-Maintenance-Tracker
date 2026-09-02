import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type, plainToInstance } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class ExtraCostDto {
  @ApiProperty({ example: 'Labor' })
  @IsString()
  name: string;

  @ApiProperty({ example: 300 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cost: number;
}

export class CreateMaintenanceRecordDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  carId: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  itemId: number;

  @ApiProperty({ example: '2025-02-01' })
  @Type(() => Date)
  @IsDate()
  maintenanceDate: Date;

  @ApiProperty({ example: 60000 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  kmCounter: number;

  @ApiProperty({ example: 150 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  itemCost: number;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  photoPath?: any;

  @ApiPropertyOptional({ type: [ExtraCostDto] })
  @Transform(({ value }) => {
    let parsed = value;
    if (typeof value === 'string') {
      try {
        parsed = JSON.parse(value);
      } catch {
        return value;
      }
    }
    if (Array.isArray(parsed)) {
      return parsed.map((item) =>
        item instanceof ExtraCostDto
          ? item
          : plainToInstance(ExtraCostDto, item),
      );
    }
    return parsed;
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExtraCostDto)
  @IsOptional()
  extraCosts?: ExtraCostDto[];

  @ApiPropertyOptional({ example: 'Routine maintenance at service center' })
  @IsString()
  @IsOptional()
  notes?: string;
}
