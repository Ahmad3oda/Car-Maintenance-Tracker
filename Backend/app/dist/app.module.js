"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const items_module_1 = require("./modules/items/items.module");
const maintenance_records_module_1 = require("./modules/maintenance-records/maintenance-records.module");
const cars_module_1 = require("./modules/cars/cars.module");
const request_logger_middleware_1 = require("./common/middlewares/request-logger.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(request_logger_middleware_1.RequestLoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqlite',
                database: process.env.DB_PATH || 'data.sqlite',
                autoLoadEntities: true,
                synchronize: true,
            }),
            items_module_1.ItemsModule,
            maintenance_records_module_1.MaintenanceRecordsModule,
            cars_module_1.CarsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map