import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { Item } from './entities/item.entity';
import { ItemsRepository } from './items.repository';
import { CarsModule } from '../cars/cars.module';

@Module({
  imports: [TypeOrmModule.forFeature([Item]), CarsModule],
  controllers: [ItemsController],
  providers: [ItemsService, ItemsRepository],
  exports: [ItemsService, ItemsRepository],
})
export class ItemsModule {}
