import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
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

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  endDate?: string;
}
