import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
import { Repository } from 'typeorm';
import { createInMemoryHttpApp } from '../../testing/in-memory-app';
import { User } from './entities/user.entity';
import { getJwtSecret } from './jwt.config';
import { PASSWORD_MESSAGES, USERNAME_MESSAGES } from './auth.rules';

interface AuthBody {
  accessToken: string;
  expiresIn: number;
  user: { id: number; username: string };
}
interface ErrorBody {
  message: string | string[];
}

describe('Auth (HTTP)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createInMemoryHttpApp();
  });

  afterEach(async () => {
    await app.close();
  });

  const register = (username: unknown, password: unknown = 'secret1') =>
    request(app.getHttpServer())
      .post('/auth/register')
      .send({ username, password });
  const login = (username: string, password: string) =>
    request(app.getHttpServer())
      .post('/auth/login')
      .send({ username, password });
  const messages = (res: request.Response) =>
    ([] as string[]).concat((res.body as ErrorBody).message);

  describe('register', () => {
    it('creates the user and returns a token, never the password', async () => {
      const res = await register('Ahmed_92', 'secret1').expect(201);
      const body = res.body as AuthBody;

      expect(body.user).toEqual({ id: 1, username: 'Ahmed_92' });
      expect(body.expiresIn).toBe(7 * 24 * 60 * 60);
      expect(JSON.stringify(body)).not.toContain('secret1');
      expect(JSON.stringify(body)).not.toMatch(/password/i);

      const payload = app
        .get(JwtService)
        .verify<{ sub: number }>(body.accessToken);
      expect(payload.sub).toBe(1);
    });

    it('stores a bcrypt hash, not the password', async () => {
      await register('ahmed', 'secret1').expect(201);
      const user = await app
        .get<Repository<User>>(getRepositoryToken(User))
        .findOneOrFail({
          where: { usernameKey: 'ahmed' },
          select: ['passwordHash'],
        });
      expect(user.passwordHash).toMatch(/^\$2[aby]\$12\$/);
      expect(user.passwordHash).not.toContain('secret1');
    });

    it.each([
      ['abc', 'shortest allowed'],
      ['a'.repeat(30), 'longest allowed'],
      ['a_1', 'letters, digits and underscore'],
      ['Zed', 'upper-case start'],
    ])('accepts %s (%s)', async (username) => {
      await register(username).expect(201);
    });

    it.each([
      ['ab', USERNAME_MESSAGES.length],
      ['a'.repeat(31), USERNAME_MESSAGES.length],
      ['1abc', USERNAME_MESSAGES.start],
      ['_abc', USERNAME_MESSAGES.start],
      ['ahmed-1', USERNAME_MESSAGES.chars],
      ['ahmed 1', USERNAME_MESSAGES.chars],
      ['ahmed.k', USERNAME_MESSAGES.chars],
      ['أحمد', USERNAME_MESSAGES.start],
      ['ahméd', USERNAME_MESSAGES.chars],
    ])('rejects username %j with "%s"', async (username, message) => {
      const res = await register(username).expect(400);
      expect(messages(res)).toContain(message);
    });

    it('rejects a missing username', async () => {
      await register(undefined).expect(400);
    });

    it('requires a password of at least 6 characters', async () => {
      const res = await register('ahmed', '12345').expect(400);
      expect(messages(res)).toEqual([PASSWORD_MESSAGES.min]);
      await register('ahmed', '123456').expect(201);
    });

    it('rejects passwords longer than bcrypt can use', async () => {
      const res = await register('ahmed', 'x'.repeat(73)).expect(400);
      expect(messages(res)).toEqual([PASSWORD_MESSAGES.max]);
    });

    it('rejects a taken username regardless of case, with a clear message', async () => {
      await register('Ahmed').expect(201);
      const res = await register('ahmed').expect(409);
      expect(messages(res)).toEqual(['Username "ahmed" is already taken']);
      await register('AHMED').expect(409);
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await register('Ahmed', 'secret1').expect(201);
    });

    it('returns a token for the right password, case-insensitively', async () => {
      const res = await login('aHMed', 'secret1').expect(200);
      const body = res.body as AuthBody;
      expect(body.user.username).toBe('Ahmed');
      expect(body.accessToken).toEqual(expect.any(String));
    });

    it('rejects a wrong password', async () => {
      const res = await login('Ahmed', 'secret2').expect(401);
      expect(messages(res)).toEqual(['Invalid username or password']);
    });

    it('gives the same answer for an unknown user', async () => {
      const res = await login('nobody', 'secret1').expect(401);
      expect(messages(res)).toEqual(['Invalid username or password']);
    });

    it('requires both fields', async () => {
      const res = await login('', '').expect(400);
      expect(messages(res)).toEqual([
        'Username is required',
        'Password is required',
      ]);
    });
  });
});

describe('getJwtSecret', () => {
  const original = process.env.JWT_SECRET;
  afterEach(() => {
    process.env.JWT_SECRET = original;
  });

  it('refuses to run without a secret', () => {
    delete process.env.JWT_SECRET;
    expect(() => getJwtSecret()).toThrow(/JWT_SECRET must be set/);
  });

  it('refuses a short secret', () => {
    process.env.JWT_SECRET = 'short';
    expect(() => getJwtSecret()).toThrow(/at least 32 characters/);
  });
});
