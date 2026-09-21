import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from './modules/items/items.module';
import { MaintenanceRecordsModule } from './modules/maintenance-records/maintenance-records.module';
import { CarsModule } from './modules/cars/cars.module';
import { RequestLoggerMiddleware } from './common/middlewares/request-logger.middleware';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDbPath } from './common/utils/paths.util';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'sqlite' as const,
        database: getDbPath(),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    ItemsModule,
    MaintenanceRecordsModule,
    CarsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
