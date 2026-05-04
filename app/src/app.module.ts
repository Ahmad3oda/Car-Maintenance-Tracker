import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from './modules/items/items.module';
import { RecordsModule } from './modules/records/records.module';
import { Item } from './modules/items/entities/item.entity';
import { Record } from './modules/records/entities/record.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_PATH || 'data.sqlite',
      entities: [Item, Record],
      synchronize: true,
    }),
    ItemsModule,
    RecordsModule,
  ],
})
export class AppModule {}
