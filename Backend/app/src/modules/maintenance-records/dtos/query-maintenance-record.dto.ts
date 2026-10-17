import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Order, PageOptionsDto } from '../../../common/dtos/page-options.dto';

export class QueryMaintenanceRecordDto extends PageOptionsDto {
  @ApiPropertyOptional({ enum: Order, default: Order.DESC })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.DESC;

  @ApiPropertyOptional({ default: 'maintenanceDate' })
  @IsString()
  @IsOptional()
  readonly sortBy?: string = 'maintenanceDate';

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  carId?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  itemId?: number;

  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ example: '2025-12-31T23:59:59.999Z' })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}
