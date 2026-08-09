import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceRecordsService } from './maintenance-records.service';
import { MaintenanceRecordsController } from './maintenance-records.controller';
import { MaintenanceRecord } from './entities/maintenance-record.entity';
import { MaintenanceRecordsRepository } from './maintenance-records.repository';
import { ItemsModule } from '../items/items.module';
import { CarsModule } from '../cars/cars.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MaintenanceRecord]),
    ItemsModule,
    CarsModule,
  ],
  controllers: [MaintenanceRecordsController],
  providers: [MaintenanceRecordsService, MaintenanceRecordsRepository],
  exports: [MaintenanceRecordsService, MaintenanceRecordsRepository],
})
export class MaintenanceRecordsModule {}
