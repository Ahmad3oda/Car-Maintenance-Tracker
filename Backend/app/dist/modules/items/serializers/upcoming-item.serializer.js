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
exports.UpcomingItemSerializer = exports.UpcomingCarSummarySerializer = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class UpcomingCarSummarySerializer {
    id;
    brand;
    model;
    plateNumber;
    currentKm;
}
exports.UpcomingCarSummarySerializer = UpcomingCarSummarySerializer;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], UpcomingCarSummarySerializer.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UpcomingCarSummarySerializer.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UpcomingCarSummarySerializer.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UpcomingCarSummarySerializer.prototype, "plateNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], UpcomingCarSummarySerializer.prototype, "currentKm", void 0);
let UpcomingItemSerializer = class UpcomingItemSerializer {
    id;
    carId;
    name;
    description;
    manufacturer;
    photoPath;
    installedDate;
    installedKm;
    expectedMaintenanceKm;
    expectedMaintenanceMonths;
    lastMaintenanceDate;
    nextMaintenanceKm;
    nextMaintenanceDate;
    currentKm;
    remainingKm;
    remainingDays;
    status;
    car;
    constructor(partial) {
        Object.assign(this, partial);
    }
};
exports.UpcomingItemSerializer = UpcomingItemSerializer;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], UpcomingItemSerializer.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], UpcomingItemSerializer.prototype, "carId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UpcomingItemSerializer.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UpcomingItemSerializer.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UpcomingItemSerializer.prototype, "manufacturer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], UpcomingItemSerializer.prototype, "photoPath", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], UpcomingItemSerializer.prototype, "installedDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], UpcomingItemSerializer.prototype, "installedKm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], UpcomingItemSerializer.prototype, "expectedMaintenanceKm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], UpcomingItemSerializer.prototype, "expectedMaintenanceMonths", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], UpcomingItemSerializer.prototype, "lastMaintenanceDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], UpcomingItemSerializer.prototype, "nextMaintenanceKm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], UpcomingItemSerializer.prototype, "nextMaintenanceDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], UpcomingItemSerializer.prototype, "currentKm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], UpcomingItemSerializer.prototype, "remainingKm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], UpcomingItemSerializer.prototype, "remainingDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['OVERDUE', 'DUE_SOON', 'UPCOMING', 'OK'],
        example: 'DUE_SOON',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UpcomingItemSerializer.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: UpcomingCarSummarySerializer }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => UpcomingCarSummarySerializer),
    __metadata("design:type", UpcomingCarSummarySerializer)
], UpcomingItemSerializer.prototype, "car", void 0);
exports.UpcomingItemSerializer = UpcomingItemSerializer = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [Object])
], UpcomingItemSerializer);
//# sourceMappingURL=upcoming-item.serializer.js.map