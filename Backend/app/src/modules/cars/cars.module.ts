import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { Car } from './entities/car.entity';
import { CarsRepository } from './cars.repository';
import { Item } from '../items/entities/item.entity';
import { MaintenanceRecord } from '../maintenance-records/entities/maintenance-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Car, Item, MaintenanceRecord])],
  controllers: [CarsController],
  providers: [CarsService, CarsRepository],
  exports: [CarsService, CarsRepository],
})
export class CarsModule {}
