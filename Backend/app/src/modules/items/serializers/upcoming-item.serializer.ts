import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

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
    enum: ['OVERDUE', 'DUE_SOON', 'UPCOMING', 'OK'],
    example: 'DUE_SOON',
  })
  @Expose()
  status: 'OVERDUE' | 'DUE_SOON' | 'UPCOMING' | 'OK';

  @ApiPropertyOptional({ type: UpcomingCarSummarySerializer })
  @Expose()
  @Type(() => UpcomingCarSummarySerializer)
  car?: UpcomingCarSummarySerializer;

  constructor(partial: Partial<UpcomingItemSerializer>) {
    Object.assign(this, partial);
  }
}
