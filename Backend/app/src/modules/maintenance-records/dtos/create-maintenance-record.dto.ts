import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsInt, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

export class ExtraCostDto {
  @ApiProperty({ example: 'Labor' })
  @IsString()
  name: string;

  @ApiProperty({ example: 300 })
  @IsNumber()
  @Min(0)
  cost: number;
}

export class CreateMaintenanceRecordDto {
  @ApiProperty()
  @IsInt()
  carId: number;

  @ApiProperty()
  @IsInt()
  itemId: number;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  maintenanceDate: Date;

  @ApiProperty()
  @IsInt()
  @Min(0)
  kmCounter: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  itemCost: number;

  @ApiPropertyOptional({ type: [ExtraCostDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExtraCostDto)
  @IsOptional()
  extraCosts?: ExtraCostDto[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}
