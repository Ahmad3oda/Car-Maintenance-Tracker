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
exports.MaintenanceRecordsService = void 0;
const common_1 = require("@nestjs/common");
const maintenance_records_repository_1 = require("./maintenance-records.repository");
const items_repository_1 = require("../items/items.repository");
const maintenance_record_serializer_1 = require("./serializers/maintenance-record.serializer");
const page_dto_1 = require("../../common/dtos/page.dto");
const page_meta_dto_1 = require("../../common/dtos/page-meta.dto");
const class_transformer_1 = require("class-transformer");
let MaintenanceRecordsService = class MaintenanceRecordsService {
    recordsRepo;
    itemsRepo;
    constructor(recordsRepo, itemsRepo) {
        this.recordsRepo = recordsRepo;
        this.itemsRepo = itemsRepo;
    }
    async create(dto) {
        const item = await this.itemsRepo.findOne(dto.itemId);
        if (!item) {
            throw new common_1.NotFoundException(`Item with ID ${dto.itemId} not found`);
        }
        const record = await this.recordsRepo.create(dto);
        item.lastMaintenanceId = record.id;
        if (item.expectedMaintenanceKm) {
            item.nextMaintenanceKm = dto.kmCounter + item.expectedMaintenanceKm;
        }
        if (item.expectedMaintenanceMonths) {
            const nextDate = new Date(dto.maintenanceDate);
            nextDate.setMonth(nextDate.getMonth() + item.expectedMaintenanceMonths);
            item.nextMaintenanceDate = nextDate;
        }
        await this.itemsRepo.save(item);
        return (0, class_transformer_1.plainToInstance)(maintenance_record_serializer_1.MaintenanceRecordSerializer, record);
    }
    async findAll(query) {
        const [records, itemCount] = await this.recordsRepo.findAll(query.page, query.limit, query.search, query.sortBy, query.order, query.carId, query.itemId);
        const pageMetaDto = new page_meta_dto_1.PageMetaDto({ itemCount, pageOptionsDto: query });
        const serializedRecords = records.map((r) => (0, class_transformer_1.plainToInstance)(maintenance_record_serializer_1.MaintenanceRecordSerializer, r));
        return new page_dto_1.PageDto(serializedRecords, pageMetaDto);
    }
    async findOne(id) {
        const record = await this.recordsRepo.findOne(id);
        if (!record) {
            throw new common_1.NotFoundException(`MaintenanceRecord with ID ${id} not found`);
        }
        return (0, class_transformer_1.plainToInstance)(maintenance_record_serializer_1.MaintenanceRecordSerializer, record);
    }
    async update(id, dto) {
        const record = await this.recordsRepo.findOne(id);
        if (!record) {
            throw new common_1.NotFoundException(`MaintenanceRecord with ID ${id} not found`);
        }
        const updatedRecord = await this.recordsRepo.update(id, dto);
        return (0, class_transformer_1.plainToInstance)(maintenance_record_serializer_1.MaintenanceRecordSerializer, updatedRecord);
    }
    async remove(id) {
        const record = await this.recordsRepo.findOne(id);
        if (!record) {
            throw new common_1.NotFoundException(`MaintenanceRecord with ID ${id} not found`);
        }
        await this.recordsRepo.remove(id);
    }
};
exports.MaintenanceRecordsService = MaintenanceRecordsService;
exports.MaintenanceRecordsService = MaintenanceRecordsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [maintenance_records_repository_1.MaintenanceRecordsRepository,
        items_repository_1.ItemsRepository])
], MaintenanceRecordsService);
//# sourceMappingURL=maintenance-records.service.js.map