import { TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { MaintenanceRecordsService } from '../maintenance-records/maintenance-records.service';
import { UpcomingScope } from './dtos/query-upcoming-item.dto';
import { createInMemoryApp, createTestUser } from '../../testing/in-memory-app';
import { CarsService } from '../cars/cars.service';
import { ItemsService } from './items.service';

describe('ItemsService (in-memory DB)', () => {
  const originalTz = process.env.TZ;
  let app: TestingModule;
  let userId: number;
  let cars: CarsService;
  let items: ItemsService;
  let records: MaintenanceRecordsService;
  let carId: number;

  beforeAll(() => {
    process.env.TZ = 'Europe/Berlin';
  });

  afterAll(() => {
    process.env.TZ = originalTz;
  });

  beforeEach(async () => {
    app = await createInMemoryApp();
    userId = await createTestUser(app);
    cars = app.get(CarsService);
    items = app.get(ItemsService);
    records = app.get(MaintenanceRecordsService);
    const car = await cars.create(userId, {
      plateNumber: 'ABC123',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      currentKm: 50000,
    });
    carId = car.id;
  });

  afterEach(async () => {
    await app.close();
  });

  it('computes the next maintenance date without a DST shift', async () => {
    const item = await items.create(userId, {
      carId,
      name: 'Oil',
      installedDate: new Date('2026-01-01T00:00:00.000Z'),
      installedKm: 45000,
      expectedMaintenanceKm: 5000,
      expectedMaintenanceMonths: 6,
    });

    expect(new Date(item.nextMaintenanceDate!).toISOString()).toBe(
      '2026-07-01T00:00:00.000Z',
    );
    expect(item.nextMaintenanceKm).toBe(50000);
  });

  it('rolls back the item and its initial record if a later write fails', async () => {
    // Fails the schedule update, after the item and record were inserted.
    const spy = jest
      .spyOn(EntityManager.prototype, 'update')
      .mockRejectedValueOnce(new Error('disk full'));

    await expect(
      items.create(userId, {
        carId,
        name: 'Oil',
        installedDate: new Date('2026-01-01T00:00:00.000Z'),
      }),
    ).rejects.toThrow('disk full');
    spy.mockRestore();

    expect((await items.findAll(userId, { carId })).data).toHaveLength(0);
    expect((await records.findAll(userId, { carId })).data).toHaveLength(0);
  });

  it("moves an item's records when the item moves to another car", async () => {
    const otherCar = await cars.create(userId, {
      plateNumber: 'XYZ9',
      brand: 'Kia',
      model: 'Rio',
      year: 2019,
      currentKm: 60000,
    });
    const item = await items.create(userId, {
      carId,
      name: 'Oil',
      installedDate: new Date('2026-01-01T00:00:00.000Z'),
      installedKm: 45000,
    });
    await records.create(userId, {
      carId,
      itemId: item.id,
      maintenanceDate: new Date('2026-03-01T00:00:00.000Z'),
      kmCounter: 48000,
      itemCost: 50,
    });

    await items.update(userId, item.id, { carId: otherCar.id });

    expect((await records.findAll(userId, { carId })).data).toHaveLength(0);
    const moved = await records.findAll(userId, { carId: otherCar.id });
    expect(moved.data).toHaveLength(2);
    expect(moved.data.every((r) => r.itemId === item.id)).toBe(true);
  });

  it('sorts upcoming items by urgency when sorting by status', async () => {
    const install = (name: string, installedKm: number) =>
      items.create(userId, {
        carId,
        name,
        installedDate: new Date('2026-01-01T00:00:00.000Z'),
        installedKm,
        expectedMaintenanceKm: 5000,
      });
    await install('ok', 50000); // 5000 km left
    await install('overdue', 40000); // -5000 km
    await install('dueSoon', 45500); // 500 km left

    const page = await items.getUpcoming(userId, {
      scope: UpcomingScope.ALL,
      sortBy: 'status',
      order: undefined,
    });
    expect(page.data.map((i) => i.status)).toEqual([
      'OVERDUE',
      'DUE_SOON',
      'OK',
    ]);
  });
});
