import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../../common/dtos/page-options.dto';

export enum UpcomingScope {
  DUE_SOON_OR_OVERDUE = 'due_soon_or_overdue',
  OVERDUE_ONLY = 'overdue_only',
  DUE_SOON_ONLY = 'due_soon_only',
  UPCOMING_ONLY = 'upcoming_only',
  HEALTHY_ONLY = 'healthy_only',
  NO_SCHEDULE = 'no_schedule',
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
    description:
      'Filter by urgency: overdue, due soon (1,000 km / 30 days), upcoming  (3,000 km / 90 days), healthy, or no schedule.',
  })
  @IsEnum(UpcomingScope)
  @IsOptional()
  scope?: UpcomingScope = UpcomingScope.DUE_SOON_OR_OVERDUE;
}
