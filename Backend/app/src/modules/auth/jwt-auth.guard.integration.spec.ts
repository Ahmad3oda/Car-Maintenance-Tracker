import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
import { Repository } from 'typeorm';
import {
  createInMemoryHttpApp,
  registerUser,
} from '../../testing/in-memory-app';
import { User } from './entities/user.entity';

const PROTECTED: [string, string][] = [
  ['get', '/auth/me'],
  ['post', '/cars'],
  ['get', '/cars'],
  ['get', '/cars/1'],
  ['patch', '/cars/1'],
  ['delete', '/cars/1'],
  ['get', '/cars/1/export'],
  ['post', '/cars/1/import'],
  ['post', '/items'],
  ['get', '/items'],
  ['get', '/items/upcoming'],
  ['get', '/items/1'],
  ['patch', '/items/1'],
  ['delete', '/items/1'],
  ['post', '/maintenance-records'],
  ['get', '/maintenance-records'],
  ['get', '/maintenance-records/1'],
  ['patch', '/maintenance-records/1'],
  ['delete', '/maintenance-records/1'],
  ['get', '/dashboard/stats'],
];

type Method = 'get' | 'post' | 'patch' | 'delete';

describe('JwtAuthGuard (HTTP)', () => {
  let app: INestApplication<App>;
  const call = (method: string, path: string) =>
    request(app.getHttpServer())[method as Method](path);

  beforeEach(async () => {
    app = await createInMemoryHttpApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it.each(PROTECTED)('%s %s requires a token', async (method, path) => {
    const res = await call(method, path).expect(401);
    expect((res.body as { message: string }).message).toBe('Login required');
  });

  // GET / (health check) is covered by test/app.e2e-spec.ts.
  it('keeps register and login public', async () => {
    await registerUser(app, 'ahmed');
    await call('post', '/auth/login')
      .send({ username: 'ahmed', password: 'secret1' })
      .expect(200);
  });

  it('accepts a valid token', async () => {
    const token = await registerUser(app, 'ahmed');
    const res = await call('get', '/auth/me')
      .auth(token, { type: 'bearer' })
      .expect(200);
    expect(res.body).toEqual({ id: 1, username: 'ahmed' });
  });

  it.each([
    ['a malformed token', () => 'not-a-jwt'],
    [
      'a token signed with another secret',
      () => new JwtService({ secret: 'x'.repeat(32) }).sign({ sub: 1 }),
    ],
  ])('rejects %s', async (_label, makeToken) => {
    await registerUser(app, 'ahmed');
    const res = await call('get', '/auth/me')
      .auth(makeToken(), { type: 'bearer' })
      .expect(401);
    expect((res.body as { message: string }).message).toBe(
      'Session expired or invalid',
    );
  });

  it('rejects an expired token', async () => {
    await registerUser(app, 'ahmed');
    const expired = app
      .get(JwtService)
      .sign({ sub: 1, username: 'ahmed' }, { expiresIn: -10 });
    await call('get', '/auth/me').auth(expired, { type: 'bearer' }).expect(401);
  });

  it('rejects the token of a deleted user', async () => {
    const token = await registerUser(app, 'ahmed');
    await app.get<Repository<User>>(getRepositoryToken(User)).delete(1);
    await call('get', '/auth/me').auth(token, { type: 'bearer' }).expect(401);
  });
});
