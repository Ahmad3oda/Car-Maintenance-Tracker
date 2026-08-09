import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { ExtraCostDto } from '../dtos/create-maintenance-record.dto';

@Exclude()
export class MaintenanceRecordSerializer {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  carId: number;

  @ApiProperty()
  @Expose()
  itemId: number;

  @ApiProperty()
  @Expose()
  maintenanceDate: Date;

  @ApiProperty()
  @Expose()
  kmCounter: number;

  @ApiProperty()
  @Expose()
  itemCost: number;

  @ApiPropertyOptional({ type: [ExtraCostDto] })
  @Expose()
  @Type(() => ExtraCostDto)
  extraCosts?: ExtraCostDto[];

  @ApiPropertyOptional()
  @Expose()
  notes?: string;

  @ApiPropertyOptional()
  @Expose()
  photoPath?: string | null;

  @ApiPropertyOptional()
  @Expose()
  car?: any;

  @ApiPropertyOptional()
  @Expose()
  item?: any;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  get totalCost(): number {
    let total = this.itemCost || 0;
    if (this.extraCosts && Array.isArray(this.extraCosts)) {
      total += this.extraCosts.reduce((sum, cost) => sum + (cost.cost || 0), 0);
    }
    return total;
  }

  constructor(partial: Partial<MaintenanceRecordSerializer>) {
    Object.assign(this, partial);
  }
}
