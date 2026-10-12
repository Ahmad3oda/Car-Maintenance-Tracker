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
});
