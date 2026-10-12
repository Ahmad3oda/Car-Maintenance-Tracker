import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarsModule } from '../modules/cars/cars.module';
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
    ],
  }).compile();
}
