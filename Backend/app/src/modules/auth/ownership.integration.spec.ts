import { INestApplication } from '@nestjs/common';
import { readdirSync } from 'fs';
import { join } from 'path';
import request from 'supertest';
import { App } from 'supertest/types';
import {
  createInMemoryHttpApp,
  registerUser,
} from '../../testing/in-memory-app';
import { getUploadDir } from '../../common/utils/paths.util';

interface Entity {
  id: number;
}
interface Page {
  data: (Entity & Record<string, unknown>)[];
  meta: { totalItems: number };
}
type Method = 'get' | 'post' | 'patch' | 'delete';

const PNG = Buffer.from('89504e470d0a1a0a', 'hex');

/**
 * Alice tries to read, change and delete Bob's data through every endpoint.
 * Each attempt must look exactly like a missing id (404) and leave Bob's
 * data untouched.
 */
describe('Per-user data isolation (HTTP)', () => {
  let app: INestApplication<App>;
  let alice: string;
  let bob: string;
  let bobCar: number;
  let bobItem: number;
  let bobRecord: number;
  let aliceCar: number;
  let aliceItem: number;
  let aliceRecord: number;

  const as = (token: string, method: Method, path: string) =>
    request(app.getHttpServer())[method](path).auth(token, { type: 'bearer' });

  const body = <T>(res: request.Response) => res.body as T;

  async function seed(token: string, plate: string, km: number) {
    const car = body<Entity>(
      await as(token, 'post', '/cars')
        .send({
          plateNumber: plate,
          brand: 'Toyota',
          model: 'Corolla',
          year: 2020,
          currentKm: km,
        })
        .expect(201),
    );
    const item = body<Entity>(
      await as(token, 'post', '/items')
        .send({
          carId: car.id,
          name: 'Oil',
          installedDate: '2026-01-01',
          installedKm: km - 9000,
          expectedMaintenanceKm: 5000,
        })
        .expect(201),
    );
    const record = body<Entity>(
      await as(token, 'post', '/maintenance-records')
        .send({
          carId: car.id,
          itemId: item.id,
          maintenanceDate: new Date().toISOString(),
          kmCounter: km - 100,
          itemCost: 100,
        })
        .expect(201),
    );
    return { car: car.id, item: item.id, record: record.id };
  }

  beforeEach(async () => {
    app = await createInMemoryHttpApp();
    alice = await registerUser(app, 'alice');
    bob = await registerUser(app, 'bob');
    ({
      car: bobCar,
      item: bobItem,
      record: bobRecord,
    } = await seed(bob, 'BOB-1', 80000));
    ({
      car: aliceCar,
      item: aliceItem,
      record: aliceRecord,
    } = await seed(alice, 'ALICE-1', 20000));
  });

  afterEach(async () => {
    await app.close();
  });

  async function expectBobUntouched() {
    const car = body<Record<string, unknown>>(
      await as(bob, 'get', `/cars/${bobCar}`).expect(200),
    );
    expect(car).toMatchObject({ plateNumber: 'BOB-1', currentKm: 80000 });
    const item = body<Record<string, unknown>>(
      await as(bob, 'get', `/items/${bobItem}`).expect(200),
    );
    expect(item).toMatchObject({ name: 'Oil', carId: bobCar });
    const record = body<Record<string, unknown>>(
      await as(bob, 'get', `/maintenance-records/${bobRecord}`).expect(200),
    );
    expect(record).toMatchObject({ itemCost: 100, carId: bobCar });
    const items = body<Page>(await as(bob, 'get', '/items').expect(200));
    expect(items.meta.totalItems).toBe(1);
  }

  // [method, path, body, 404 message] — Bob's ids filled in at run time.
  const foreignAttempts: [
    string,
    Method,
    () => string,
    () => object | undefined,
    () => string,
  ][] = [
    [
      'read car',
      'get',
      () => `/cars/${bobCar}`,
      () => undefined,
      () => `Car with ID ${bobCar} not found`,
    ],
    [
      'update car',
      'patch',
      () => `/cars/${bobCar}`,
      () => ({ brand: 'Hacked', currentKm: 99 }),
      () => `Car with ID ${bobCar} not found`,
    ],
    [
      'delete car',
      'delete',
      () => `/cars/${bobCar}`,
      () => undefined,
      () => `Car with ID ${bobCar} not found`,
    ],
    [
      'export car',
      'get',
      () => `/cars/${bobCar}/export`,
      () => undefined,
      () => `Car with ID ${bobCar} not found`,
    ],
    [
      'import into car',
      'post',
      () => `/cars/${bobCar}/import`,
      () => ({ items: [{ name: 'Injected' }] }),
      () => `Car with ID ${bobCar} not found`,
    ],
    [
      'add item to car',
      'post',
      () => '/items',
      () => ({ carId: bobCar, name: 'Injected', installedDate: '2026-01-01' }),
      () => `Car with ID ${bobCar} not found`,
    ],
    [
      'read item',
      'get',
      () => `/items/${bobItem}`,
      () => undefined,
      () => `Item with ID ${bobItem} not found`,
    ],
    [
      'update item',
      'patch',
      () => `/items/${bobItem}`,
      () => ({ name: 'Hacked' }),
      () => `Item with ID ${bobItem} not found`,
    ],
    [
      'delete item',
      'delete',
      () => `/items/${bobItem}`,
      () => undefined,
      () => `Item with ID ${bobItem} not found`,
    ],
    [
      'move own item into car',
      'patch',
      () => `/items/${aliceItem}`,
      () => ({ carId: bobCar }),
      () => `Car with ID ${bobCar} not found`,
    ],
    [
      'add record to item',
      'post',
      () => '/maintenance-records',
      () => ({
        carId: bobCar,
        itemId: bobItem,
        maintenanceDate: '2026-05-01',
        kmCounter: 999999,
        itemCost: 1,
      }),
      () => `Item with ID ${bobItem} not found`,
    ],
    [
      'read record',
      'get',
      () => `/maintenance-records/${bobRecord}`,
      () => undefined,
      () => `MaintenanceRecord with ID ${bobRecord} not found`,
    ],
    [
      'update record',
      'patch',
      () => `/maintenance-records/${bobRecord}`,
      () => ({ itemCost: 1, kmCounter: 999999 }),
      () => `MaintenanceRecord with ID ${bobRecord} not found`,
    ],
    [
      'delete record',
      'delete',
      () => `/maintenance-records/${bobRecord}`,
      () => undefined,
      () => `MaintenanceRecord with ID ${bobRecord} not found`,
    ],
    [
      'move own record onto item',
      'patch',
      () => `/maintenance-records/${aliceRecord}`,
      () => ({ itemId: bobItem }),
      () => `Item with ID ${bobItem} not found`,
    ],
  ];

  it.each(foreignAttempts)(
    'cannot %s of another user (404, data unchanged)',
    async (_label, method, path, payload, message) => {
      let req = as(alice, method, path());
      const data = payload();
      if (data) req = req.send(data);
      const res = await req.expect(404);
      expect(body<{ message: string }>(res).message).toBe(message());
      await expectBobUntouched();
    },
  );

  it('answers a foreign id exactly like a missing one', async () => {
    const foreign = await as(alice, 'get', `/cars/${bobCar}`).expect(404);
    const missing = await as(alice, 'get', '/cars/999').expect(404);
    expect(Object.keys(foreign.body as object)).toEqual(
      Object.keys(missing.body as object),
    );
  });

  it('rejects a foreign photo update and deletes the uploaded file', async () => {
    const dir = join(getUploadDir(), 'cars');
    const before = readdirSync(dir).length;
    await as(alice, 'patch', `/cars/${bobCar}`)
      .attach('photoPath', PNG, { filename: 'x.png', contentType: 'image/png' })
      .expect(404);
    expect(readdirSync(dir).length).toBe(before);
    await expectBobUntouched();
  });

  describe('lists only contain own data', () => {
    it.each([
      ['/cars', 'car'],
      ['/cars?search=Toyota', 'car'],
      ['/cars?search=BOB', 'none'],
      ['/items', 'item'],
      [`/items?carId=BOBCAR`, 'none'],
      ['/items?search=Oil', 'item'],
      ['/maintenance-records', 'record'],
      ['/maintenance-records?carId=BOBCAR', 'none'],
      ['/maintenance-records?itemId=BOBITEM', 'none'],
      ['/maintenance-records?search=Toyota', 'record'],
      ['/items/upcoming?scope=all', 'item'],
    ])('GET %s', async (path, expected) => {
      const url = path
        .replace('BOBCAR', String(bobCar))
        .replace('BOBITEM', String(bobItem));
      const page = body<Page>(await as(alice, 'get', url).expect(200));
      const ids = page.data.map((e) => e.id);

      if (expected === 'none') {
        expect(ids).toEqual([]);
      } else if (expected === 'car') {
        expect(ids).toEqual([aliceCar]);
      } else if (expected === 'item') {
        expect(ids).toEqual([aliceItem]);
      } else {
        // Alice's own record plus her item's installation record.
        expect(page.data.every((r) => r.carId === aliceCar)).toBe(true);
        expect(ids).toContain(aliceRecord);
      }
      expect(page.meta.totalItems).toBe(ids.length);
    });
  });

  it('dashboard stats count only own data', async () => {
    const stats = body<Record<string, number>>(
      await as(alice, 'get', '/dashboard/stats').expect(200),
    );
    expect(stats).toEqual({
      totalCars: 1,
      totalItems: 1,
      itemsReplacedLastMonth: 1,
      itemsReplacedLastYear: 1,
      costSpentLastMonth: 100,
      costSpentLastYear: 100,
    });
  });

  it('a new user sees nothing at all', async () => {
    const carol = await registerUser(app, 'carol');
    for (const path of [
      '/cars',
      '/items',
      '/maintenance-records',
      '/items/upcoming?scope=all',
    ]) {
      const page = body<Page>(await as(carol, 'get', path).expect(200));
      expect(page.data).toEqual([]);
    }
    const stats = body<Record<string, number>>(
      await as(carol, 'get', '/dashboard/stats').expect(200),
    );
    expect(Object.values(stats).every((v) => v === 0)).toBe(true);
  });

  it('plate numbers stay unique across users (documented limitation)', async () => {
    const res = await as(alice, 'post', '/cars')
      .send({ plateNumber: 'BOB-1', brand: 'Kia', model: 'Rio', year: 2020 })
      .expect(400);
    expect(body<{ message: string }>(res).message).toBe(
      'Car with plate number BOB-1 is already registered',
    );
  });
});
