import { BadRequestException } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { createInMemoryApp } from '../../testing/in-memory-app';
import { CarsService } from '../cars/cars.service';
import { ItemsService } from '../items/items.service';
import { MaintenanceRecordsService } from './maintenance-records.service';

describe('MaintenanceRecordsService (in-memory DB)', () => {
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

  const logService = (km: number, date = '2026-05-01T00:00:00.000Z') =>
    records.create({
      carId,
      itemId,
      maintenanceDate: new Date(date),
      kmCounter: km,
      itemCost: 100,
    });

  describe('same-day records', () => {
    it('schedules from the higher-km record, whatever the insert order', async () => {
      const high = await logService(48000);
      await logService(47000);

      const item = await items.findOne(itemId);
      expect(item.lastMaintenanceId).toBe(high.id);
      expect(item.nextMaintenanceKm).toBe(53000);
    });
  });

  describe('car / item consistency', () => {
    let otherCarId: number;

    beforeEach(async () => {
      otherCarId = (
        await cars.create({
          plateNumber: 'XYZ9',
          brand: 'Kia',
          model: 'Rio',
          year: 2019,
          currentKm: 10000,
        })
      ).id;
    });

    it('rejects creating a record for a car the item does not belong to', async () => {
      await expect(
        records.create({
          carId: otherCarId,
          itemId,
          maintenanceDate: new Date('2026-05-01'),
          kmCounter: 48000,
          itemCost: 100,
        }),
      ).rejects.toThrow(
        new BadRequestException(
          `Item ${itemId} belongs to car ${carId}, not car ${otherCarId}`,
        ),
      );
      const page = await records.findAll({ carId: otherCarId });
      expect(page.data).toHaveLength(0);
    });

    it('rejects moving a record to another car', async () => {
      const record = await logService(48000);
      await expect(
        records.update(record.id, { carId: otherCarId }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect((await records.findOne(record.id)).carId).toBe(carId);
    });

    it("follows the new item's car when a record moves to another item", async () => {
      const otherItem = await items.create({
        carId: otherCarId,
        name: 'Tyres',
        installedDate: new Date('2026-01-01'),
        installedKm: 9000,
      });
      const record = await logService(48000);

      const updated = await records.update(record.id, {
        itemId: otherItem.id,
      });
      expect(updated.carId).toBe(otherCarId);
    });
  });
});
