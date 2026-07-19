"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceRecordsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const maintenance_records_service_1 = require("./maintenance-records.service");
const maintenance_records_controller_1 = require("./maintenance-records.controller");
const maintenance_record_entity_1 = require("./entities/maintenance-record.entity");
const maintenance_records_repository_1 = require("./maintenance-records.repository");
const items_module_1 = require("../items/items.module");
let MaintenanceRecordsModule = class MaintenanceRecordsModule {
};
exports.MaintenanceRecordsModule = MaintenanceRecordsModule;
exports.MaintenanceRecordsModule = MaintenanceRecordsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([maintenance_record_entity_1.MaintenanceRecord]),
            items_module_1.ItemsModule,
        ],
        controllers: [maintenance_records_controller_1.MaintenanceRecordsController],
        providers: [maintenance_records_service_1.MaintenanceRecordsService, maintenance_records_repository_1.MaintenanceRecordsRepository],
        exports: [maintenance_records_service_1.MaintenanceRecordsService, maintenance_records_repository_1.MaintenanceRecordsRepository],
    })
], MaintenanceRecordsModule);
//# sourceMappingURL=maintenance-records.module.js.map