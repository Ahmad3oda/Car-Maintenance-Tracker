import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../../common/dtos/page-options.dto';

export enum UpcomingScope {
  DUE_SOON_OR_OVERDUE = 'due_soon_or_overdue',
  OVERDUE_ONLY = 'overdue_only',
  WITHIN_1K_KM = 'within_1k_km',
  WITHIN_30_DAYS = 'within_30_days',
  ALL = 'all',
}

export const UPCOMING_SORT_FIELDS = [
  'car',
  'name',
  'nextMaintenanceKm',
  'nextMaintenanceDate',
  'remainingKm',
  'remainingDays',
  'status',
] as const;
export type UpcomingSortField = (typeof UPCOMING_SORT_FIELDS)[number];

export class QueryUpcomingItemDto extends PageOptionsDto {
  @ApiPropertyOptional({ enum: UPCOMING_SORT_FIELDS })
  @IsIn(UPCOMING_SORT_FIELDS)
  @IsOptional()
  readonly sortBy?: UpcomingSortField = undefined;

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
