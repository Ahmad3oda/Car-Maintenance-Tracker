import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

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
  maintenanceRecords?: any[];

  @ApiPropertyOptional()
  @Expose()
  lastMaintenanceId?: number;

  @ApiPropertyOptional()
  @Expose()
  lastMaintenanceDate?: Date;

  @ApiPropertyOptional()
  @Expose()
  get lastInstallment(): Date | null {
    if (
      this.maintenanceRecords &&
      Array.isArray(this.maintenanceRecords) &&
      this.maintenanceRecords.length > 0
    ) {
      const sorted = [...this.maintenanceRecords].sort(
        (a, b) =>
          new Date(b.maintenanceDate).getTime() -
          new Date(a.maintenanceDate).getTime(),
      );
      if (sorted[0]?.maintenanceDate) {
        return sorted[0].maintenanceDate;
      }
    }
    if (this.lastMaintenanceDate) {
      return this.lastMaintenanceDate;
    }
    return this.installedDate || null;
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
