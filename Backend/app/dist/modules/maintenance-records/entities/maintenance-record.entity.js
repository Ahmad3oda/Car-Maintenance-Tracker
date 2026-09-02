"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceRecord = void 0;
const typeorm_1 = require("typeorm");
const car_entity_1 = require("../../cars/entities/car.entity");
const item_entity_1 = require("../../items/entities/item.entity");
let MaintenanceRecord = class MaintenanceRecord {
    id;
    carId;
    car;
    itemId;
    item;
    maintenanceDate;
    kmCounter;
    itemCost;
    extraCosts;
    notes;
    photoPath;
    createdAt;
    updatedAt;
};
exports.MaintenanceRecord = MaintenanceRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MaintenanceRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MaintenanceRecord.prototype, "carId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => car_entity_1.Car, (car) => car.maintenanceRecords, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'carId' }),
    __metadata("design:type", car_entity_1.Car)
], MaintenanceRecord.prototype, "car", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MaintenanceRecord.prototype, "itemId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => item_entity_1.Item, (item) => item.maintenanceRecords, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'itemId' }),
    __metadata("design:type", item_entity_1.Item)
], MaintenanceRecord.prototype, "item", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], MaintenanceRecord.prototype, "maintenanceDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], MaintenanceRecord.prototype, "kmCounter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'real' }),
    __metadata("design:type", Number)
], MaintenanceRecord.prototype, "itemCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], MaintenanceRecord.prototype, "extraCosts", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MaintenanceRecord.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], MaintenanceRecord.prototype, "photoPath", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MaintenanceRecord.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MaintenanceRecord.prototype, "updatedAt", void 0);
exports.MaintenanceRecord = MaintenanceRecord = __decorate([
    (0, typeorm_1.Entity)('maintenance_records')
], MaintenanceRecord);
//# sourceMappingURL=maintenance-record.entity.js.map