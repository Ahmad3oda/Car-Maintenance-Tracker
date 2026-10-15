import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { MaintenanceStatus } from '../maintenance-status';

export class UpcomingCarSummarySerializer {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  brand: string;

  @ApiProperty()
  @Expose()
  model: string;

  @ApiProperty()
  @Expose()
  plateNumber: string;

  @ApiProperty()
  @Expose()
  currentKm: number;
}

@Exclude()
export class UpcomingItemSerializer {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  carId: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiPropertyOptional()
  @Expose()
  description?: string;

  @ApiPropertyOptional()
  @Expose()
  manufacturer?: string;

  @ApiPropertyOptional()
  @Expose()
  photoPath?: string | null;

  @ApiPropertyOptional()
  @Expose()
  installedDate?: Date;

  @ApiPropertyOptional()
  @Expose()
  installedKm?: number;

  @ApiPropertyOptional()
  @Expose()
  expectedMaintenanceKm?: number;

  @ApiPropertyOptional()
  @Expose()
  expectedMaintenanceMonths?: number;

  @ApiPropertyOptional()
  @Expose()
  lastMaintenanceDate?: Date;

  @ApiPropertyOptional()
  @Expose()
  nextMaintenanceKm?: number | null;

  @ApiPropertyOptional()
  @Expose()
  nextMaintenanceDate?: Date | null;

  @ApiPropertyOptional()
  @Expose()
  currentKm?: number;

  @ApiPropertyOptional()
  @Expose()
  remainingKm?: number | null;

  @ApiPropertyOptional()
  @Expose()
  remainingDays?: number | null;

  @ApiProperty({
    enum: MaintenanceStatus,
    example: MaintenanceStatus.DUE_SOON,
    description:
      'OVERDUE: past due km or date. DUE_SOON: within 1,000 km or 30 days. UPCOMING: future due exists outside that window. HEALTHY: schedule in place with nothing approaching.',
  })
  @Expose()
  status: MaintenanceStatus;

  @ApiPropertyOptional({ type: UpcomingCarSummarySerializer })
  @Expose()
  @Type(() => UpcomingCarSummarySerializer)
  car?: UpcomingCarSummarySerializer;

  constructor(partial: Partial<UpcomingItemSerializer>) {
    Object.assign(this, partial);
  }
}
