import { TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { MaintenanceRecordsService } from '../maintenance-records/maintenance-records.service';
import { createInMemoryApp } from '../../testing/in-memory-app';
import { CarsService } from '../cars/cars.service';
import { ItemsService } from './items.service';

describe('ItemsService (in-memory DB)', () => {
  const originalTz = process.env.TZ;
  let app: TestingModule;
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
    cars = app.get(CarsService);
    items = app.get(ItemsService);
    records = app.get(MaintenanceRecordsService);
    const car = await cars.create({
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
    const item = await items.create({
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
      items.create({
        carId,
        name: 'Oil',
        installedDate: new Date('2026-01-01T00:00:00.000Z'),
      }),
    ).rejects.toThrow('disk full');
    spy.mockRestore();

    expect((await items.findAll({ carId })).data).toHaveLength(0);
    expect((await records.findAll({ carId })).data).toHaveLength(0);
  });
});
