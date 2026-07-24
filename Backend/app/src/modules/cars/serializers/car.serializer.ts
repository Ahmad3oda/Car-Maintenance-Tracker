import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
// import { ItemSerializer } from '../../items/serializers/item.serializer'; // will be added later

@Exclude()
export class CarSerializer {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  plateNumber: string;

  @ApiProperty()
  @Expose()
  brand: string;

  @ApiProperty()
  @Expose()
  model: string;

  @ApiProperty()
  @Expose()
  year: number;

  @ApiPropertyOptional()
  @Expose()
  photoPath: string | null;

  @ApiProperty()
  @Expose()
  currentKm: number;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<CarSerializer>) {
    Object.assign(this, partial);
  }
}
