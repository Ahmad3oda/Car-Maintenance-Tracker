import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { configureApp } from '../app.setup';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarsModule } from '../modules/cars/cars.module';
import { DashboardModule } from '../modules/dashboard/dashboard.module';
import { AuthModule } from '../modules/auth/auth.module';
import { ItemsModule } from '../modules/items/items.module';
import { MaintenanceRecordsModule } from '../modules/maintenance-records/maintenance-records.module';

/** Real services backed by a fresh in-memory SQLite database. */
export async function createInMemoryApp(): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        autoLoadEntities: true,
        synchronize: true,
        dropSchema: true,
      }),
      CarsModule,
      ItemsModule,
      MaintenanceRecordsModule,
      DashboardModule,
      AuthModule,
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
