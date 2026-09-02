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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceRecordsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const maintenance_records_service_1 = require("./maintenance-records.service");
const create_maintenance_record_dto_1 = require("./dtos/create-maintenance-record.dto");
const update_maintenance_record_dto_1 = require("./dtos/update-maintenance-record.dto");
const query_maintenance_record_dto_1 = require("./dtos/query-maintenance-record.dto");
const maintenance_record_serializer_1 = require("./serializers/maintenance-record.serializer");
const page_dto_1 = require("../../common/dtos/page.dto");
const multer_util_1 = require("../../common/utils/multer.util");
let MaintenanceRecordsController = class MaintenanceRecordsController {
    recordsService;
    constructor(recordsService) {
        this.recordsService = recordsService;
    }
    create(createDto, files) {
        const photo = files?.photoPath?.[0] || files?.photo?.[0];
        return this.recordsService.create(createDto, photo?.filename);
    }
    findAll(query) {
        return this.recordsService.findAll(query);
    }
    findOne(id) {
        return this.recordsService.findOne(id);
    }
    update(id, updateDto, files) {
        const photo = files?.photoPath?.[0] || files?.photo?.[0];
        return this.recordsService.update(id, updateDto, photo?.filename);
    }
    remove(id) {
        return this.recordsService.remove(id);
    }
};
exports.MaintenanceRecordsController = MaintenanceRecordsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new maintenance record' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The record has been successfully created.',
        type: maintenance_record_serializer_1.MaintenanceRecordSerializer,
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'photoPath', maxCount: 1 },
        { name: 'photo', maxCount: 1 },
    ], { storage: (0, multer_util_1.createMulterStorage)('maintenance-records') })),
    (0, common_1.SerializeOptions)({ type: maintenance_record_serializer_1.MaintenanceRecordSerializer }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_maintenance_record_dto_1.CreateMaintenanceRecordDto, Object]),
    __metadata("design:returntype", Promise)
], MaintenanceRecordsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all maintenance records with pagination' }),
    (0, swagger_1.ApiExtraModels)(page_dto_1.PageDto, maintenance_record_serializer_1.MaintenanceRecordSerializer),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of maintenance records.',
        schema: {
            allOf: [
                { $ref: (0, swagger_1.getSchemaPath)(page_dto_1.PageDto) },
                {
                    properties: {
                        data: {
                            type: 'array',
                            items: { $ref: (0, swagger_1.getSchemaPath)(maintenance_record_serializer_1.MaintenanceRecordSerializer) },
                        },
                    },
                },
            ],
        },
    }),
    (0, common_1.SerializeOptions)({ type: (page_dto_1.PageDto) }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_maintenance_record_dto_1.QueryMaintenanceRecordDto]),
    __metadata("design:returntype", Promise)
], MaintenanceRecordsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a maintenance record by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The record.',
        type: maintenance_record_serializer_1.MaintenanceRecordSerializer,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Record not found.' }),
    (0, common_1.SerializeOptions)({ type: maintenance_record_serializer_1.MaintenanceRecordSerializer }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MaintenanceRecordsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a maintenance record' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The record has been successfully updated.',
        type: maintenance_record_serializer_1.MaintenanceRecordSerializer,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Record not found.' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'photoPath', maxCount: 1 },
        { name: 'photo', maxCount: 1 },
    ], { storage: (0, multer_util_1.createMulterStorage)('maintenance-records') })),
    (0, common_1.SerializeOptions)({ type: maintenance_record_serializer_1.MaintenanceRecordSerializer }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_maintenance_record_dto_1.UpdateMaintenanceRecordDto, Object]),
    __metadata("design:returntype", Promise)
], MaintenanceRecordsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a maintenance record' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'The record has been successfully deleted.',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Record not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MaintenanceRecordsController.prototype, "remove", null);
exports.MaintenanceRecordsController = MaintenanceRecordsController = __decorate([
    (0, swagger_1.ApiTags)('Maintenance Records'),
    (0, common_1.Controller)('maintenance-records'),
    __metadata("design:paramtypes", [maintenance_records_service_1.MaintenanceRecordsService])
], MaintenanceRecordsController);
//# sourceMappingURL=maintenance-records.controller.js.map