import { BadRequestException, Injectable } from '@nestjs/common';
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

  /**
   * Raises the odometer to the highest recorded km.
   * `replacedKm` is a record reading that was just lowered, removed or moved
   * away; if the odometer came from it, it drops to the highest remaining
   * reading, so correcting a typo in a record corrects the car too.
   */
  async sync(carId: number, replacedKm?: number): Promise<void> {
    const maxKm = await this.maxRecordedKm(carId);
    const car = await this.cars.findOneBy({ id: carId });
    if (maxKm === null || !car) return;

    const raise = maxKm > car.currentKm;
    const correct = replacedKm === car.currentKm && maxKm < car.currentKm;
    if (raise || correct) {
      await this.cars.update(carId, { currentKm: maxKm });
    }
  }

  /** Rejects a manual reading below what the maintenance records prove. */
  async assertNotBelowRecords(carId: number, currentKm: number) {
    const maxKm = await this.maxRecordedKm(carId);
    if (maxKm !== null && currentKm < maxKm) {
      throw new BadRequestException(
        `currentKm cannot be lower than ${maxKm} km, the highest reading in ` +
          `this car's maintenance records. If that reading is wrong, edit ` +
          `the maintenance record instead.`,
      );
    }
  }
}
