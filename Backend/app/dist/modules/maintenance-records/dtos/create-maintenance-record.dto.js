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
exports.CreateMaintenanceRecordDto = exports.ExtraCostDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ExtraCostDto {
    name;
    cost;
}
exports.ExtraCostDto = ExtraCostDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Labor' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExtraCostDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 300 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ExtraCostDto.prototype, "cost", void 0);
class CreateMaintenanceRecordDto {
    carId;
    itemId;
    maintenanceDate;
    kmCounter;
    itemCost;
    extraCosts;
    notes;
}
exports.CreateMaintenanceRecordDto = CreateMaintenanceRecordDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateMaintenanceRecordDto.prototype, "carId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateMaintenanceRecordDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateMaintenanceRecordDto.prototype, "maintenanceDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateMaintenanceRecordDto.prototype, "kmCounter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateMaintenanceRecordDto.prototype, "itemCost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [ExtraCostDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ExtraCostDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateMaintenanceRecordDto.prototype, "extraCosts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMaintenanceRecordDto.prototype, "notes", void 0);
//# sourceMappingURL=create-maintenance-record.dto.js.map