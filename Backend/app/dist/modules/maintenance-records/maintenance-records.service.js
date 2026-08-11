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
const cars_repository_1 = require("../cars/cars.repository");
const maintenance_record_serializer_1 = require("./serializers/maintenance-record.serializer");
const page_dto_1 = require("../../common/dtos/page.dto");
const page_meta_dto_1 = require("../../common/dtos/page-meta.dto");
const class_transformer_1 = require("class-transformer");
const multer_util_1 = require("../../common/utils/multer.util");
let MaintenanceRecordsService = class MaintenanceRecordsService {
    recordsRepo;
    itemsRepo;
    carsRepo;
    constructor(recordsRepo, itemsRepo, carsRepo) {
        this.recordsRepo = recordsRepo;
        this.itemsRepo = itemsRepo;
        this.carsRepo = carsRepo;
    }
    async create(dto, photo) {
        const item = await this.itemsRepo.findOne(dto.itemId);
        if (!item) {
            if (photo) {
                await (0, multer_util_1.deleteUploadedFile)('maintenance-records', photo);
            }
            throw new common_1.NotFoundException(`Item with ID ${dto.itemId} not found`);
        }
        const carId = dto.carId || item.carId;
        const car = await this.carsRepo.findOne(carId);
        if (!car) {
            if (photo) {
                await (0, multer_util_1.deleteUploadedFile)('maintenance-records', photo);
            }
            throw new common_1.NotFoundException(`Car with ID ${carId} not found`);
        }
        const recordData = {
            ...dto,
            carId,
            photoPath: photo ?? null,
        };
        const record = await this.recordsRepo.create(recordData);
        await this.updateItemMaintenanceStatus(item.id);
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
    async update(id, dto, photo) {
        const record = await this.recordsRepo.findOne(id);
        if (!record) {
            if (photo) {
                await (0, multer_util_1.deleteUploadedFile)('maintenance-records', photo);
            }
            throw new common_1.NotFoundException(`MaintenanceRecord with ID ${id} not found`);
        }
        if (dto.itemId && dto.itemId !== record.itemId) {
            const item = await this.itemsRepo.findOne(dto.itemId);
            if (!item) {
                if (photo) {
                    await (0, multer_util_1.deleteUploadedFile)('maintenance-records', photo);
                }
                throw new common_1.NotFoundException(`Item with ID ${dto.itemId} not found`);
            }
        }
        if (dto.carId && dto.carId !== record.carId) {
            const car = await this.carsRepo.findOne(dto.carId);
            if (!car) {
                if (photo) {
                    await (0, multer_util_1.deleteUploadedFile)('maintenance-records', photo);
                }
                throw new common_1.NotFoundException(`Car with ID ${dto.carId} not found`);
            }
        }
        const updateData = { ...dto };
        if (photo) {
            if (record.photoPath) {
                await (0, multer_util_1.deleteUploadedFile)('maintenance-records', record.photoPath);
            }
            updateData.photoPath = photo;
        }
        const updatedRecord = await this.recordsRepo.update(id, updateData);
        await this.updateItemMaintenanceStatus(record.itemId);
        if (dto.itemId && dto.itemId !== record.itemId) {
            await this.updateItemMaintenanceStatus(dto.itemId);
        }
        return (0, class_transformer_1.plainToInstance)(maintenance_record_serializer_1.MaintenanceRecordSerializer, updatedRecord);
    }
    async remove(id) {
        const record = await this.recordsRepo.findOne(id);
        if (!record) {
            throw new common_1.NotFoundException(`MaintenanceRecord with ID ${id} not found`);
        }
        const itemId = record.itemId;
        if (record.photoPath) {
            await (0, multer_util_1.deleteUploadedFile)('maintenance-records', record.photoPath);
        }
        await this.recordsRepo.remove(id);
        await this.updateItemMaintenanceStatus(itemId);
    }
    async updateItemMaintenanceStatus(itemId) {
        const item = await this.itemsRepo.findOne(itemId);
        if (!item)
            return;
        const [records] = await this.recordsRepo.findAll(1, 1000, undefined, 'maintenanceDate', 'DESC', undefined, itemId);
        const latestRecord = records[0];
        const updateData = {};
        if (latestRecord) {
            updateData.lastMaintenanceId = latestRecord.id;
            updateData.lastMaintenanceDate = latestRecord.maintenanceDate;
            if (item.expectedMaintenanceKm) {
                updateData.nextMaintenanceKm =
                    Number(latestRecord.kmCounter) + Number(item.expectedMaintenanceKm);
            }
            if (item.expectedMaintenanceMonths) {
                const nextDate = new Date(latestRecord.maintenanceDate);
                nextDate.setMonth(nextDate.getMonth() + Number(item.expectedMaintenanceMonths));
                updateData.nextMaintenanceDate = nextDate;
            }
        }
        else {
            updateData.lastMaintenanceId = null;
            updateData.lastMaintenanceDate = null;
            if (item.installedKm && item.expectedMaintenanceKm) {
                updateData.nextMaintenanceKm =
                    Number(item.installedKm) + Number(item.expectedMaintenanceKm);
            }
            else {
                updateData.nextMaintenanceKm = null;
            }
            if (item.installedDate && item.expectedMaintenanceMonths) {
                const nextDate = new Date(item.installedDate);
                nextDate.setMonth(nextDate.getMonth() + Number(item.expectedMaintenanceMonths));
                updateData.nextMaintenanceDate = nextDate;
            }
            else {
                updateData.nextMaintenanceDate = null;
            }
        }
        await this.itemsRepo.update(item.id, updateData);
    }
};
exports.MaintenanceRecordsService = MaintenanceRecordsService;
exports.MaintenanceRecordsService = MaintenanceRecordsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [maintenance_records_repository_1.MaintenanceRecordsRepository,
        items_repository_1.ItemsRepository,
        cars_repository_1.CarsRepository])
], MaintenanceRecordsService);
//# sourceMappingURL=maintenance-records.service.js.map