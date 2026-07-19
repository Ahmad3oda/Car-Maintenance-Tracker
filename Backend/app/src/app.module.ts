import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from './modules/items/items.module';
import { MaintenanceRecordsModule } from './modules/maintenance-records/maintenance-records.module';
import { CarsModule } from './modules/cars/cars.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_PATH || 'data.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ItemsModule,
    MaintenanceRecordsModule,
    CarsModule,
  ],
})
export class AppModule {}
