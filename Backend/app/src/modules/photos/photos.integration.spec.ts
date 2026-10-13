import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import {
  createInMemoryHttpApp,
  registerUser,
} from '../../testing/in-memory-app';

const PNG = Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex');

interface WithPhoto {
  id: number;
  photoPath: string;
}

describe('Photos (HTTP)', () => {
  let app: INestApplication<App>;
  let alice: string;
  let bob: string;
  let carPhoto: string;
  let itemPhoto: string;
  let recordPhoto: string;
  let carId: number;

  const http = () => request(app.getHttpServer());
  const get = (path: string, token?: string) => {
    const req = http().get(path).buffer(true);
    return token ? req.auth(token, { type: 'bearer' }) : req;
  };
  const upload = (
    path: string,
    fields: Record<string, string | number>,
    method: 'post' | 'patch' = 'post',
  ) => {
    let req = http()[method](path).auth(alice, { type: 'bearer' });
    for (const [key, value] of Object.entries(fields)) {
      req = req.field(key, String(value));
    }
    return req.attach('photoPath', PNG, {
      filename: 'photo.png',
      contentType: 'image/png',
    });
  };

  beforeEach(async () => {
    app = await createInMemoryHttpApp();
    alice = await registerUser(app, 'alice');
    bob = await registerUser(app, 'bob');

    const car = (
      await upload('/cars', {
        plateNumber: 'A-1',
        brand: 'Kia',
        model: 'Rio',
        year: 2020,
        currentKm: 5000,
      }).expect(201)
    ).body as WithPhoto;
    carId = car.id;
    carPhoto = `/uploads/cars/${car.photoPath}`;

    const item = (
      await upload('/items', {
        carId,
        name: 'Oil',
        installedDate: '2026-01-01',
      }).expect(201)
    ).body as WithPhoto;
    itemPhoto = `/uploads/items/${item.photoPath}`;

    const record = (
      await upload('/maintenance-records', {
        carId,
        itemId: item.id,
        maintenanceDate: '2026-02-01',
        kmCounter: 5000,
        itemCost: 10,
      }).expect(201)
    ).body as WithPhoto;
    recordPhoto = `/uploads/maintenance-records/${record.photoPath}`;
  });

  afterEach(async () => {
    await app.close();
  });

  it.each([
    ['car', () => carPhoto],
    ['item', () => itemPhoto],
    ['record', () => recordPhoto],
  ])("serves the owner's %s photo with safe headers", async (_l, path) => {
    const res = await get(path(), alice).expect(200);
    expect(res.headers['content-type']).toBe('image/png');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['content-security-policy']).toBe("default-src 'none'");
    expect(res.headers['cache-control']).toBe('private, no-store');
    expect(Buffer.compare(res.body as Buffer, PNG)).toBe(0);
  });

  it.each([
    ['car', () => carPhoto],
    ['item', () => itemPhoto],
    ['record', () => recordPhoto],
  ])("returns 404 for another user's %s photo", async (_l, path) => {
    const res = await get(path(), bob).expect(404);
    expect((res.body as { message: string }).message).toBe('Photo not found');
  });

  it('rejects requests without a token', async () => {
    const res = await get(carPhoto).expect(401);
    expect((res.body as { message: string }).message).toBe('Login required');
  });

  it("answers another user's photo exactly like a missing one", async () => {
    const foreign = await get(carPhoto, bob).expect(404);
    const missing = await get(
      '/uploads/cars/00000000-0000-4000-8000-000000000000.png',
      bob,
    ).expect(404);
    expect(foreign.body).toEqual(missing.body);
  });

  it.each([
    '/uploads/cars/..%2F..%2Fpackage.json',
    '/uploads/../package.json',
    '/uploads/secrets/00000000-0000-4000-8000-000000000000.png',
    '/uploads/cars/not-a-uuid.png',
    '/uploads/cars/00000000-0000-4000-8000-000000000000.svg',
  ])('does not serve %s', async (path) => {
    const res = await get(path, alice);
    expect(res.status).toBe(404);
  });

  it('stops serving a photo once it is replaced or its car is deleted', async () => {
    const replaced = (await upload(`/cars/${carId}`, {}, 'patch').expect(200))
      .body as WithPhoto;
    await get(carPhoto, alice).expect(404);

    const newPhoto = `/uploads/cars/${replaced.photoPath}`;
    await get(newPhoto, alice).expect(200);
    await http()
      .delete(`/cars/${carId}`)
      .auth(alice, { type: 'bearer' })
      .expect(204);
    await get(newPhoto, alice).expect(404);
  });
});
