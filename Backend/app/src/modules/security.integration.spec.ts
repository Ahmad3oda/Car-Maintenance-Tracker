import { INestApplication } from '@nestjs/common';
import { existsSync, rmSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import request from 'supertest';
import { App } from 'supertest/types';
import { createInMemoryHttpApp, registerUser } from '../testing/in-memory-app';
import { getUploadDir } from '../common/utils/paths.util';

/** A file outside the uploads folder that no request may ever delete. */
const victim = () => join(dirname(getUploadDir()), 'cmt-victim.txt');
const TRAVERSAL = '../../cmt-victim.txt';

describe('photoPath from the request body (HTTP)', () => {
  let app: INestApplication<App>;
  let token: string;

  beforeEach(async () => {
    app = await createInMemoryHttpApp();
    token = await registerUser(app, 'owner');
    writeFileSync(victim(), 'keep me');
  });

  afterEach(async () => {
    rmSync(victim(), { force: true });
    await app.close();
  });

  const api = () => request(app.getHttpServer());

  const createCar = async () =>
    (
      await api()
        .post('/cars')
        .auth(token, { type: 'bearer' })
        .send({ plateNumber: 'P1', brand: 'Kia', model: 'Rio', year: 2020 })
        .expect(201)
    ).body as { id: number };

  it('is ignored on car update, so deleting the car cannot remove other files', async () => {
    const car = await createCar();
    const res = await api()
      .patch(`/cars/${car.id}`)
      .auth(token, { type: 'bearer' })
      .send({ photoPath: TRAVERSAL })
      .expect(200);
    expect((res.body as { photoPath: unknown }).photoPath).toBeNull();

    await api()
      .delete(`/cars/${car.id}`)
      .auth(token, { type: 'bearer' })
      .expect(204);
    expect(existsSync(victim())).toBe(true);
  });

  it('is ignored on item and record updates', async () => {
    const car = await createCar();
    const item = (
      await api()
        .post('/items')
        .auth(token, { type: 'bearer' })
        .send({ carId: car.id, name: 'Oil', installedDate: '2025-01-01' })
        .expect(201)
    ).body as { id: number; maintenanceRecords: { id: number }[] };

    const itemRes = await api()
      .patch(`/items/${item.id}`)
      .auth(token, { type: 'bearer' })
      .send({ photoPath: TRAVERSAL })
      .expect(200);
    expect((itemRes.body as { photoPath: unknown }).photoPath).toBeNull();

    const recordId = item.maintenanceRecords[0].id;
    const recordRes = await api()
      .patch(`/maintenance-records/${recordId}`)
      .auth(token, { type: 'bearer' })
      .send({ photoPath: TRAVERSAL })
      .expect(200);
    expect((recordRes.body as { photoPath: unknown }).photoPath).toBeNull();

    await api()
      .delete(`/maintenance-records/${recordId}`)
      .auth(token, { type: 'bearer' })
      .expect(204);
    await api()
      .delete(`/items/${item.id}`)
      .auth(token, { type: 'bearer' })
      .expect(204);
    expect(existsSync(victim())).toBe(true);
  });
});

describe('Maintenance record date filters (HTTP)', () => {
  let app: INestApplication<App>;
  let token: string;

  beforeEach(async () => {
    app = await createInMemoryHttpApp();
    token = await registerUser(app, 'owner');
  });

  afterEach(async () => {
    await app.close();
  });

  it('accepts ISO dates and rejects anything else with 400', async () => {
    await request(app.getHttpServer())
      .get('/maintenance-records')
      .query({ startDate: '2025-01-01T00:00:00.000Z' })
      .auth(token, { type: 'bearer' })
      .expect(200);
    await request(app.getHttpServer())
      .get('/maintenance-records')
      .query({ startDate: 'not-a-date' })
      .auth(token, { type: 'bearer' })
      .expect(400);
  });
});

describe('Login rate limit (HTTP)', () => {
  let app: INestApplication<App>;
  const previous = process.env.AUTH_RATE_LIMIT;

  beforeEach(async () => {
    process.env.AUTH_RATE_LIMIT = '3';
    app = await createInMemoryHttpApp();
  });

  afterEach(async () => {
    process.env.AUTH_RATE_LIMIT = previous;
    await app.close();
  });

  it('answers 429 after too many attempts from one client', async () => {
    const login = () =>
      request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'nobody', password: 'wrong-password' });

    for (let i = 0; i < 3; i++) {
      await login().expect(401);
    }
    await login().expect(429);
  });
});
