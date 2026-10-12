import { TestingModule } from '@nestjs/testing';
import { createInMemoryApp } from '../../testing/in-memory-app';
import { CarsService } from './cars.service';
import { ItemsService } from '../items/items.service';
import { MaintenanceRecordsService } from '../maintenance-records/maintenance-records.service';

describe('Odometer rules (in-memory DB)', () => {
  let app: TestingModule;
  let cars: CarsService;
  let items: ItemsService;
  let records: MaintenanceRecordsService;
  let carId: number;
  let itemId: number;

  beforeEach(async () => {
    app = await createInMemoryApp();
    cars = app.get(CarsService);
    items = app.get(ItemsService);
    records = app.get(MaintenanceRecordsService);

    carId = (
      await cars.create({
        plateNumber: 'ABC123',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2020,
        currentKm: 50000,
      })
    ).id;
    itemId = (
      await items.create({
        carId,
        name: 'Oil',
        installedDate: new Date('2026-01-01T00:00:00.000Z'),
        installedKm: 45000,
        expectedMaintenanceKm: 5000,
      })
    ).id;
  });

  afterEach(async () => {
    await app.close();
  });

  const odometer = async () => (await cars.findOne(carId)).currentKm;
  const logService = (kmCounter: number) =>
    records.create({
      carId,
      itemId,
      maintenanceDate: new Date('2026-05-01T00:00:00.000Z'),
      kmCounter,
      itemCost: 100,
    });

  describe('records raise the odometer', () => {
    it('raises it when a record is above the current reading', async () => {
      await logService(52000);
      expect(await odometer()).toBe(52000);
    });

    it('leaves it alone when a record is below the current reading', async () => {
      await logService(48000);
      expect(await odometer()).toBe(50000);
    });

    it('raises it when a record is edited above the current reading', async () => {
      const record = await logService(48000);
      await records.update(record.id, { kmCounter: 51000 });
      expect(await odometer()).toBe(51000);
    });

    it('raises it when an item is installed above the current reading', async () => {
      await items.create({
        carId,
        name: 'Tyres',
        installedDate: new Date('2026-06-01T00:00:00.000Z'),
        installedKm: 53000,
      });
      expect(await odometer()).toBe(53000);
    });

    it('raises it on import', async () => {
      await cars.importCarData(carId, {
        items: [
          {
            name: 'Brakes',
            events: [
              {
                maintenanceDate: '2026-07-01T00:00:00.000Z',
                kmCounter: 56000,
                itemCost: 0,
              },
            ],
          },
        ],
      });
      expect(await odometer()).toBe(56000);
    });
  });
});
