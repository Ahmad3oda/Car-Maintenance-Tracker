import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { MaintenanceRecord } from '../maintenance-records/entities/maintenance-record.entity';

/** Keeps a car's odometer consistent with its maintenance records. */
@Injectable()
export class OdometerService {
  constructor(
    @InjectRepository(Car)
    private readonly cars: Repository<Car>,
    @InjectRepository(MaintenanceRecord)
    private readonly records: Repository<MaintenanceRecord>,
  ) {}

  /** Highest km in the car's maintenance records, or null if it has none. */
  async maxRecordedKm(carId: number): Promise<number | null> {
    return this.records.maximum('kmCounter', { carId });
  }

  /** Raises the odometer to the highest recorded km; never lowers it. */
  async sync(carId: number): Promise<void> {
    const maxKm = await this.maxRecordedKm(carId);
    if (maxKm === null) return;
    await this.cars
      .createQueryBuilder()
      .update(Car)
      .set({ currentKm: maxKm })
      .where('id = :carId AND currentKm < :maxKm', { carId, maxKm })
      .execute();
  }
}
