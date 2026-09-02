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
exports.ImportResultDto = exports.ExportCarDataDto = exports.ExportCarSummaryDto = exports.ImportCarDataDto = exports.ImportItemDto = exports.ImportMaintenanceRecordDto = exports.ImportExtraCostDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ImportExtraCostDto {
    name;
    cost;
}
exports.ImportExtraCostDto = ImportExtraCostDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Labor' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ImportExtraCostDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25.0 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ImportExtraCostDto.prototype, "cost", void 0);
class ImportMaintenanceRecordDto {
    maintenanceDate;
    kmCounter;
    itemCost;
    extraCosts;
    notes;
}
exports.ImportMaintenanceRecordDto = ImportMaintenanceRecordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-06-15T00:00:00.000Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ImportMaintenanceRecordDto.prototype, "maintenanceDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 60000 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ImportMaintenanceRecordDto.prototype, "kmCounter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 45.0 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ImportMaintenanceRecordDto.prototype, "itemCost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [ImportExtraCostDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ImportExtraCostDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], ImportMaintenanceRecordDto.prototype, "extraCosts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Routine filter change' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ImportMaintenanceRecordDto.prototype, "notes", void 0);
class ImportItemDto {
    name;
    description;
    manufacturer;
    installedDate;
    installedKm;
    expectedMaintenanceKm;
    expectedMaintenanceMonths;
    events;
}
exports.ImportItemDto = ImportItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Engine Oil & Filter' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ImportItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '5W-30 Full Synthetic' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ImportItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Castrol' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ImportItemDto.prototype, "manufacturer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2024-01-15T00:00:00.000Z' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ImportItemDto.prototype, "installedDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 40000 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ImportItemDto.prototype, "installedKm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10000 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ImportItemDto.prototype, "expectedMaintenanceKm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 6 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ImportItemDto.prototype, "expectedMaintenanceMonths", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [ImportMaintenanceRecordDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ImportMaintenanceRecordDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], ImportItemDto.prototype, "events", void 0);
class ImportCarDataDto {
    version;
    items;
}
exports.ImportCarDataDto = ImportCarDataDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1.0' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ImportCarDataDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ImportItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ImportItemDto),
    __metadata("design:type", Array)
], ImportCarDataDto.prototype, "items", void 0);
class ExportCarSummaryDto {
    plateNumber;
    brand;
    model;
    year;
    currentKm;
}
exports.ExportCarSummaryDto = ExportCarSummaryDto;
class ExportCarDataDto {
    version;
    exportedAt;
    car;
    items;
}
exports.ExportCarDataDto = ExportCarDataDto;
class ImportResultDto {
    success;
    importedItems;
    importedEvents;
    message;
}
exports.ImportResultDto = ImportResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ImportResultDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], ImportResultDto.prototype, "importedItems", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8 }),
    __metadata("design:type", Number)
], ImportResultDto.prototype, "importedEvents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Successfully imported 3 items and 8 maintenance records' }),
    __metadata("design:type", String)
], ImportResultDto.prototype, "message", void 0);
//# sourceMappingURL=import-export.dto.js.map