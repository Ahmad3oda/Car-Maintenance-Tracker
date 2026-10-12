import { TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { createInMemoryApp, createTestUser } from '../testing/in-memory-app';
import { CarsService } from '../modules/cars/cars.service';
import { assignOrphanCars } from './assign-cars';

describe('assignOrphanCars', () => {
  let app: TestingModule;
  let dataSource: DataSource;
  let ownerId: number;
  let otherId: number;

  beforeEach(async () => {
    app = await createInMemoryApp();
    dataSource = app.get(DataSource);
    ownerId = await createTestUser(app, 'Ahmed');
    otherId = await createTestUser(app, 'other');
    // One car that already has an owner, two legacy cars without one.
    await app.get(CarsService).create(otherId, {
      plateNumber: 'OWNED',
      brand: 'Kia',
      model: 'Rio',
      year: 2020,
    });
    await dataSource.query(
      `INSERT INTO cars (plateNumber, brand, model, year) VALUES ('OLD-1','a','b',2010), ('OLD-2','a','b',2011)`,
    );
  });

  afterEach(async () => {
    await app.close();
  });

  const owners = () =>
    dataSource.query<{ plateNumber: string; userId: number | null }[]>(
      `SELECT plateNumber, userId FROM cars ORDER BY id`,
    );

  it('gives only the owner-less cars to the user (case-insensitive name)', async () => {
    const result = await assignOrphanCars(dataSource, 'ahmed');
    expect(result).toEqual({ username: 'Ahmed', carIds: [2, 3] });
    expect(await owners()).toEqual([
      { plateNumber: 'OWNED', userId: otherId },
      { plateNumber: 'OLD-1', userId: ownerId },
      { plateNumber: 'OLD-2', userId: ownerId },
    ]);
  });

  it('changes nothing on a dry run', async () => {
    const result = await assignOrphanCars(dataSource, 'Ahmed', {
      dryRun: true,
    });
    expect(result.carIds).toEqual([2, 3]);
    expect((await owners()).filter((c) => c.userId === null)).toHaveLength(2);
  });

  it('refuses an unknown user', async () => {
    await expect(assignOrphanCars(dataSource, 'nobody')).rejects.toThrow(
      'No user named "nobody"; register it first',
    );
  });

  it('is a no-op when every car has an owner', async () => {
    await assignOrphanCars(dataSource, 'Ahmed');
    expect((await assignOrphanCars(dataSource, 'Ahmed')).carIds).toEqual([]);
  });
});
