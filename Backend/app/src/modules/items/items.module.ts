import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { Item } from './entities/item.entity';
import { ItemsRepository } from './items.repository';
import { MaintenanceRecord } from '../maintenance-records/entities/maintenance-record.entity';
import { MaintenanceRecordsRepository } from '../maintenance-records/maintenance-records.repository';
import { CarsModule } from '../cars/cars.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item, MaintenanceRecord]),
    CarsModule,
  ],
  controllers: [ItemsController],
  providers: [ItemsService, ItemsRepository, MaintenanceRecordsRepository],
  exports: [ItemsService, ItemsRepository],
})
export class ItemsModule {}
