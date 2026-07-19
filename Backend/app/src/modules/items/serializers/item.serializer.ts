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
  serialNumber?: string;

  @ApiPropertyOptional()
  @Expose()
  photoPath?: string;

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
  lastMaintenanceId?: number;

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
