"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const items_service_1 = require("./items.service");
const items_controller_1 = require("./items.controller");
const item_entity_1 = require("./entities/item.entity");
const items_repository_1 = require("./items.repository");
const maintenance_record_entity_1 = require("../maintenance-records/entities/maintenance-record.entity");
const maintenance_records_repository_1 = require("../maintenance-records/maintenance-records.repository");
const cars_module_1 = require("../cars/cars.module");
let ItemsModule = class ItemsModule {
};
exports.ItemsModule = ItemsModule;
exports.ItemsModule = ItemsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([item_entity_1.Item, maintenance_record_entity_1.MaintenanceRecord]),
            cars_module_1.CarsModule,
        ],
        controllers: [items_controller_1.ItemsController],
        providers: [items_service_1.ItemsService, items_repository_1.ItemsRepository, maintenance_records_repository_1.MaintenanceRecordsRepository],
        exports: [items_service_1.ItemsService, items_repository_1.ItemsRepository],
    })
], ItemsModule);
//# sourceMappingURL=items.module.js.map