import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from '../../../common/dtos/page-options.dto';

export enum UpcomingScope {
  DUE_SOON_OR_OVERDUE = 'due_soon_or_overdue',
  OVERDUE_ONLY = 'overdue_only',
  WITHIN_1K_KM = 'within_1k_km',
  WITHIN_30_DAYS = 'within_30_days',
  ALL = 'all',
}

export class QueryUpcomingItemDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  carId?: number;

  @ApiPropertyOptional({
    enum: UpcomingScope,
    default: UpcomingScope.DUE_SOON_OR_OVERDUE,
    description: 'Filter scope for upcoming items',
  })
  @IsEnum(UpcomingScope)
  @IsOptional()
  scope?: UpcomingScope = UpcomingScope.DUE_SOON_OR_OVERDUE;
}
