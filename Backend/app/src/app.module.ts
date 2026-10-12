import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from './modules/items/items.module';
import { MaintenanceRecordsModule } from './modules/maintenance-records/maintenance-records.module';
import { CarsModule } from './modules/cars/cars.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AuthModule } from './modules/auth/auth.module';
import { PhotosModule } from './modules/photos/photos.module';
import { RequestLoggerMiddleware } from './common/middlewares/request-logger.middleware';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from './database/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      // Pending migrations run on every startup (local and Railway).
      // A local SQLite file has no transient outages; retrying a failed
      // migration only delays the crash.
      useFactory: () => ({
        ...dataSourceOptions,
        migrationsRun: true,
        retryAttempts: 0,
      }),
    }),
    ItemsModule,
    MaintenanceRecordsModule,
    CarsModule,
    DashboardModule,
    AuthModule,
    PhotosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
