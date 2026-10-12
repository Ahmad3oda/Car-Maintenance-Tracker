import { BadRequestException } from '@nestjs/common';
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

  describe('manual corrections', () => {
    it('allows lowering a mistyped reading down to the highest record', async () => {
      await cars.update(carId, { currentKm: 500000 });
      await logService(48000);

      await cars.update(carId, { currentKm: 48000 });
      expect(await odometer()).toBe(48000);
    });

    it('rejects a reading below the highest record with the minimum allowed', async () => {
      await logService(48000);

      await expect(cars.update(carId, { currentKm: 47999 })).rejects.toThrow(
        new BadRequestException(
          "currentKm cannot be lower than 48000 km, the highest reading in this car's maintenance records. If that reading is wrong, edit the maintenance record instead.",
        ),
      );
      expect(await odometer()).toBe(50000);
    });

    it('allows any reading for a car without records', async () => {
      const bare = await cars.create({
        plateNumber: 'NEW1',
        brand: 'Kia',
        model: 'Rio',
        year: 2024,
        currentKm: 500000,
      });
      await cars.update(bare.id, { currentKm: 50 });
      expect((await cars.findOne(bare.id)).currentKm).toBe(50);
    });
  });

  describe('correcting a wrong record', () => {
    it('lowers the odometer and the item schedule when the typo record is fixed', async () => {
      const typo = await logService(99999);
      expect(await odometer()).toBe(99999);

      await records.update(typo.id, { kmCounter: 51000 });

      expect(await odometer()).toBe(51000);
      expect((await items.findOne(itemId)).nextMaintenanceKm).toBe(56000);
    });

    it('falls back to the highest remaining record when the typo record is deleted', async () => {
      await logService(49000);
      const typo = await logService(99999);

      await records.remove(typo.id);

      expect(await odometer()).toBe(49000);
      expect((await items.findOne(itemId)).nextMaintenanceKm).toBe(54000);
    });

    it('keeps a manual reading that did not come from the edited record', async () => {
      const record = await logService(48000);
      await cars.update(carId, { currentKm: 60000 });

      await records.update(record.id, { kmCounter: 47000 });
      expect(await odometer()).toBe(60000);
    });

    it('lowers the old car when its highest-km item moves away', async () => {
      const other = await cars.create({
        plateNumber: 'XYZ9',
        brand: 'Kia',
        model: 'Rio',
        year: 2019,
        currentKm: 1000,
      });
      const tyres = await items.create({
        carId,
        name: 'Tyres',
        installedDate: new Date('2026-02-01T00:00:00.000Z'),
        installedKm: 70000,
      });
      expect(await odometer()).toBe(70000);

      await items.update(tyres.id, { carId: other.id });

      expect(await odometer()).toBe(45000);
      expect((await cars.findOne(other.id)).currentKm).toBe(70000);
    });
  });
});
