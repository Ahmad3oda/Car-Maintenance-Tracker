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
exports.QueryUpcomingItemDto = exports.UpcomingScope = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const page_options_dto_1 = require("../../../common/dtos/page-options.dto");
var UpcomingScope;
(function (UpcomingScope) {
    UpcomingScope["DUE_SOON_OR_OVERDUE"] = "due_soon_or_overdue";
    UpcomingScope["OVERDUE_ONLY"] = "overdue_only";
    UpcomingScope["WITHIN_1K_KM"] = "within_1k_km";
    UpcomingScope["WITHIN_30_DAYS"] = "within_30_days";
    UpcomingScope["ALL"] = "all";
})(UpcomingScope || (exports.UpcomingScope = UpcomingScope = {}));
class QueryUpcomingItemDto extends page_options_dto_1.PageOptionsDto {
    carId;
    scope = UpcomingScope.DUE_SOON_OR_OVERDUE;
}
exports.QueryUpcomingItemDto = QueryUpcomingItemDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QueryUpcomingItemDto.prototype, "carId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: UpcomingScope,
        default: UpcomingScope.DUE_SOON_OR_OVERDUE,
        description: 'Filter scope for upcoming items',
    }),
    (0, class_validator_1.IsEnum)(UpcomingScope),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryUpcomingItemDto.prototype, "scope", void 0);
//# sourceMappingURL=query-upcoming-item.dto.js.map