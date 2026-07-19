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
exports.MaintenanceRecordSerializer = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const create_maintenance_record_dto_1 = require("../dtos/create-maintenance-record.dto");
let MaintenanceRecordSerializer = class MaintenanceRecordSerializer {
    id;
    carId;
    itemId;
    maintenanceDate;
    kmCounter;
    itemCost;
    extraCosts;
    notes;
    createdAt;
    updatedAt;
    get totalCost() {
        let total = this.itemCost || 0;
        if (this.extraCosts && Array.isArray(this.extraCosts)) {
            total += this.extraCosts.reduce((sum, cost) => sum + (cost.cost || 0), 0);
        }
        return total;
    }
    constructor(partial) {
        Object.assign(this, partial);
    }
};
exports.MaintenanceRecordSerializer = MaintenanceRecordSerializer;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], MaintenanceRecordSerializer.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], MaintenanceRecordSerializer.prototype, "carId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], MaintenanceRecordSerializer.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], MaintenanceRecordSerializer.prototype, "maintenanceDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], MaintenanceRecordSerializer.prototype, "kmCounter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], MaintenanceRecordSerializer.prototype, "itemCost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [create_maintenance_record_dto_1.ExtraCostDto] }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => create_maintenance_record_dto_1.ExtraCostDto),
    __metadata("design:type", Array)
], MaintenanceRecordSerializer.prototype, "extraCosts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], MaintenanceRecordSerializer.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], MaintenanceRecordSerializer.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], MaintenanceRecordSerializer.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], MaintenanceRecordSerializer.prototype, "totalCost", null);
exports.MaintenanceRecordSerializer = MaintenanceRecordSerializer = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [Object])
], MaintenanceRecordSerializer);
//# sourceMappingURL=maintenance-record.serializer.js.map