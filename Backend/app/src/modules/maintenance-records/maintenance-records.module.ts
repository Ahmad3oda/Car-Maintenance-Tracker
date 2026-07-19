import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceRecordsService } from './maintenance-records.service';
import { MaintenanceRecordsController } from './maintenance-records.controller';
import { MaintenanceRecord } from './entities/maintenance-record.entity';
import { MaintenanceRecordsRepository } from './maintenance-records.repository';
import { ItemsModule } from '../items/items.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MaintenanceRecord]),
    ItemsModule, // Important for injecting ItemsRepository
  ],
  controllers: [MaintenanceRecordsController],
  providers: [MaintenanceRecordsService, MaintenanceRecordsRepository],
  exports: [MaintenanceRecordsService, MaintenanceRecordsRepository],
})
export class MaintenanceRecordsModule {}
