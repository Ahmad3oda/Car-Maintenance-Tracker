import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { configureApp } from '../app.setup';
import { dataSourceOptions } from '../database/data-source';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../modules/auth/entities/user.entity';
import { CarsModule } from '../modules/cars/cars.module';
import { DashboardModule } from '../modules/dashboard/dashboard.module';
import { AuthModule } from '../modules/auth/auth.module';
import { PhotosModule } from '../modules/photos/photos.module';
import { ItemsModule } from '../modules/items/items.module';
import { MaintenanceRecordsModule } from '../modules/maintenance-records/maintenance-records.module';

/** Real services backed by a fresh in-memory SQLite database. */
export async function createInMemoryApp(): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [
      // Same migrations as production, so tests exercise them too.
      TypeOrmModule.forRoot({
        ...dataSourceOptions,
        database: ':memory:',
        migrationsRun: true,
      }),
      CarsModule,
      ItemsModule,
      MaintenanceRecordsModule,
      DashboardModule,
      AuthModule,
      PhotosModule,
    ],
  }).compile();
}

/** The in-memory app as an HTTP server, configured like main.ts. */
export async function createInMemoryHttpApp(): Promise<INestApplication<App>> {
  const app = (await createInMemoryApp()).createNestApplication<
    INestApplication<App>
  >();
  configureApp(app);
  await app.init();
  return app;
}

/** Registers a user over HTTP and returns its Bearer token. */
export async function registerUser(
  app: INestApplication<App>,
  username: string,
  password = 'secret1',
): Promise<string> {
  const res = await request(app.getHttpServer())
    .post('/auth/register')
    .send({ username, password })
    .expect(201);
  return (res.body as { accessToken: string }).accessToken;
}

/** Inserts a user directly (no HTTP) and returns its id. */
export async function createTestUser(
  moduleRef: TestingModule,
  username = 'owner',
): Promise<number> {
  const users = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  const user = await users.save(
    users.create({
      username,
      usernameKey: username.toLowerCase(),
      passwordHash: 'not-a-real-hash',
    }),
  );
  return user.id;
}
