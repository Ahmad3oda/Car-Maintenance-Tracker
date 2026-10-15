import { TestingModule } from '@nestjs/testing';
import { createInMemoryApp, createTestUser } from '../../testing/in-memory-app';
import { CarsService } from '../cars/cars.service';
import { ItemsService } from '../items/items.service';
import { MaintenanceRecordsService } from '../maintenance-records/maintenance-records.service';
import { DashboardService } from './dashboard.service';

describe('DashboardService (in-memory DB)', () => {
  const now = new Date('2026-10-13T12:00:00.000Z');
  let app: TestingModule;
  let userId: number;
  let dashboard: DashboardService;
  let records: MaintenanceRecordsService;
  let carId: number;
  let itemId: number;

  beforeEach(async () => {
    app = await createInMemoryApp();
    userId = await createTestUser(app);
    dashboard = app.get(DashboardService);
    records = app.get(MaintenanceRecordsService);
    carId = (
      await app.get(CarsService).create(userId, {
        plateNumber: 'ABC123',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2020,
        currentKm: 50000,
      })
    ).id;
    // Creates an initial installation record dated 10 days ago.
    itemId = (
      await app.get(ItemsService).create(userId, {
        carId,
        name: 'Oil',
        installedDate: new Date('2026-10-03T00:00:00.000Z'),
        installedKm: 45000,
      })
    ).id;
  });

  afterEach(async () => {
    await app.close();
  });

  const log = (date: string, itemCost: number, extra = 0) =>
    records.create(userId, {
      carId,
      itemId,
      maintenanceDate: new Date(date),
      kmCounter: 46000,
      itemCost,
      extraCosts: extra ? [{ name: 'Labor', cost: extra }] : undefined,
    });

  it('counts services and spend per window, excluding installation baselines', async () => {
    await log('2026-10-01T00:00:00.000Z', 100, 50); // last month
    await log('2026-03-01T00:00:00.000Z', 200); // last year
    await log('2025-01-01T00:00:00.000Z', 999); // older than a year
    await log('2026-12-01T00:00:00.000Z', 999); // future-dated

    expect(await dashboard.getStats(userId, now)).toEqual({
      totalCars: 1,
      totalItems: 1,
      itemsReplacedLastMonth: 1,
      itemsReplacedLastYear: 2,
      costSpentLastMonth: 150,
      costSpentLastYear: 350,
    });
  });

  it('includes the cost of an installation record', async () => {
    const page = await records.findAll(userId, { itemId });
    await records.update(userId, page.data[0].id, { itemCost: 80 });

    const stats = await dashboard.getStats(userId, now);
    expect(stats.itemsReplacedLastMonth).toBe(0);
    expect(stats.costSpentLastMonth).toBe(80);
  });

  it('is not capped at 500 records', async () => {
    for (let i = 0; i < 510; i++) {
      await log('2026-09-20T00:00:00.000Z', 1);
    }
    const stats = await dashboard.getStats(userId, now);
    expect(stats.itemsReplacedLastMonth).toBe(510);
    // 510 sequential inserts outrun Jest's 5 s default on slower machines.
  }, 60_000);
});
