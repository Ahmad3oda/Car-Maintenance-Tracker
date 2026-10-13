import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { pickLatestRecord, ScheduleRecord } from '../maintenance-schedule.util';

@Exclude()
export class ItemSerializer {
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
  maintenanceRecords?: ScheduleRecord[];

  @ApiPropertyOptional()
  @Expose()
  car?: any;

  @ApiPropertyOptional()
  @Expose()
  lastMaintenanceId?: number;

  @ApiPropertyOptional()
  @Expose()
  lastMaintenanceDate?: Date;

  @ApiPropertyOptional()
  @Expose()
  get lastInstallment(): Date | null {
    const latest = pickLatestRecord(this.maintenanceRecords);
    if (latest?.maintenanceDate) {
      return new Date(latest.maintenanceDate);
    }
    if (this.lastMaintenanceDate) {
      return this.lastMaintenanceDate;
    }
    return null;
  }

  @ApiPropertyOptional()
  @Expose()
  nextMaintenanceKm?: number;

  @ApiPropertyOptional()
  @Expose()
  nextMaintenanceDate?: Date;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<ItemSerializer>) {
    Object.assign(this, partial);
  }
}
