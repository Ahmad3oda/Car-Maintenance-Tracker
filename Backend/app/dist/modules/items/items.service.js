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
exports.ItemsService = void 0;
const common_1 = require("@nestjs/common");
const items_repository_1 = require("./items.repository");
const cars_repository_1 = require("../cars/cars.repository");
const query_upcoming_item_dto_1 = require("./dtos/query-upcoming-item.dto");
const item_serializer_1 = require("./serializers/item.serializer");
const upcoming_item_serializer_1 = require("./serializers/upcoming-item.serializer");
const page_dto_1 = require("../../common/dtos/page.dto");
const page_meta_dto_1 = require("../../common/dtos/page-meta.dto");
const class_transformer_1 = require("class-transformer");
const multer_util_1 = require("../../common/utils/multer.util");
const maintenance_records_repository_1 = require("../maintenance-records/maintenance-records.repository");
let ItemsService = class ItemsService {
    itemsRepo;
    carsRepo;
    recordsRepo;
    constructor(itemsRepo, carsRepo, recordsRepo) {
        this.itemsRepo = itemsRepo;
        this.carsRepo = carsRepo;
        this.recordsRepo = recordsRepo;
    }
    async create(dto, photo) {
        const car = await this.carsRepo.findOne(dto.carId);
        if (!car) {
            if (photo) {
                await (0, multer_util_1.deleteUploadedFile)('items', photo);
            }
            throw new common_1.NotFoundException(`Car with ID ${dto.carId} not found`);
        }
        const installedKm = dto.installedKm !== undefined && dto.installedKm !== null
            ? Number(dto.installedKm)
            : Number(car.currentKm || 0);
        const installedDate = dto.installedDate
            ? new Date(dto.installedDate)
            : new Date();
        let nextMaintenanceKm = null;
        if (dto.expectedMaintenanceKm) {
            nextMaintenanceKm = installedKm + Number(dto.expectedMaintenanceKm);
        }
        let nextMaintenanceDate = null;
        if (dto.expectedMaintenanceMonths) {
            const d = new Date(installedDate);
            d.setMonth(d.getMonth() + Number(dto.expectedMaintenanceMonths));
            nextMaintenanceDate = d;
        }
        const itemData = {
            ...dto,
            installedKm,
            installedDate,
            nextMaintenanceKm,
            nextMaintenanceDate,
            photoPath: photo ?? null,
        };
        const savedItem = await this.itemsRepo.create(itemData);
        const initialRecord = await this.recordsRepo.create({
            carId: dto.carId,
            itemId: savedItem.id,
            maintenanceDate: installedDate,
            kmCounter: installedKm,
            itemCost: 0,
            notes: 'Initial component installation',
        });
        const updatedItem = await this.itemsRepo.update(savedItem.id, {
            lastMaintenanceId: initialRecord.id,
            lastMaintenanceDate: installedDate,
        });
        return (0, class_transformer_1.plainToInstance)(item_serializer_1.ItemSerializer, updatedItem || savedItem);
    }
    async findAll(query) {
        const [items, itemCount] = await this.itemsRepo.findAll(query.page, query.limit, query.search, query.sortBy, query.order, query.carId);
        const pageMetaDto = new page_meta_dto_1.PageMetaDto({ itemCount, pageOptionsDto: query });
        const serializedItems = items.map((item) => (0, class_transformer_1.plainToInstance)(item_serializer_1.ItemSerializer, item));
        return new page_dto_1.PageDto(serializedItems, pageMetaDto);
    }
    async findOne(id) {
        const item = await this.itemsRepo.findOne(id);
        if (!item) {
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        return (0, class_transformer_1.plainToInstance)(item_serializer_1.ItemSerializer, item);
    }
    async update(id, dto, photo) {
        const item = await this.itemsRepo.findOne(id);
        if (!item) {
            if (photo) {
                await (0, multer_util_1.deleteUploadedFile)('items', photo);
            }
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        let targetCar = item.car;
        if (dto.carId && dto.carId !== item.carId) {
            const car = await this.carsRepo.findOne(dto.carId);
            if (!car) {
                if (photo) {
                    await (0, multer_util_1.deleteUploadedFile)('items', photo);
                }
                throw new common_1.NotFoundException(`Car with ID ${dto.carId} not found`);
            }
            targetCar = car;
        }
        const updateData = { ...dto };
        if (photo) {
            if (item.photoPath) {
                await (0, multer_util_1.deleteUploadedFile)('items', item.photoPath);
            }
            updateData.photoPath = photo;
        }
        const records = item.maintenanceRecords || [];
        const sortedRecords = [...records].sort((a, b) => new Date(b.maintenanceDate).getTime() -
            new Date(a.maintenanceDate).getTime());
        const latestRecord = sortedRecords[0];
        const expectedKm = dto.expectedMaintenanceKm !== undefined
            ? dto.expectedMaintenanceKm
            : item.expectedMaintenanceKm;
        if (expectedKm === null || expectedKm === undefined || Number(expectedKm) <= 0) {
            updateData.expectedMaintenanceKm = null;
            updateData.nextMaintenanceKm = null;
        }
        else {
            updateData.expectedMaintenanceKm = Number(expectedKm);
            if (latestRecord) {
                updateData.nextMaintenanceKm =
                    Number(latestRecord.kmCounter) + Number(expectedKm);
            }
            else {
                const installedKm = dto.installedKm !== undefined && dto.installedKm !== null
                    ? dto.installedKm
                    : item.installedKm;
                const baseKm = installedKm !== undefined && installedKm !== null
                    ? Number(installedKm)
                    : Number(targetCar?.currentKm || 0);
                updateData.nextMaintenanceKm = baseKm + Number(expectedKm);
            }
        }
        const expectedMonths = dto.expectedMaintenanceMonths !== undefined
            ? dto.expectedMaintenanceMonths
            : item.expectedMaintenanceMonths;
        if (expectedMonths === null || expectedMonths === undefined || Number(expectedMonths) <= 0) {
            updateData.expectedMaintenanceMonths = null;
            updateData.nextMaintenanceDate = null;
        }
        else {
            updateData.expectedMaintenanceMonths = Number(expectedMonths);
            if (latestRecord) {
                const d = new Date(latestRecord.maintenanceDate);
                d.setMonth(d.getMonth() + Number(expectedMonths));
                updateData.nextMaintenanceDate = d;
            }
            else {
                const installedDate = dto.installedDate !== undefined && dto.installedDate !== null
                    ? dto.installedDate
                    : item.installedDate;
                const d = installedDate ? new Date(installedDate) : new Date();
                d.setMonth(d.getMonth() + Number(expectedMonths));
                updateData.nextMaintenanceDate = d;
            }
        }
        const updatedItem = await this.itemsRepo.update(id, updateData);
        return (0, class_transformer_1.plainToInstance)(item_serializer_1.ItemSerializer, updatedItem);
    }
    async remove(id) {
        const item = await this.itemsRepo.findOne(id);
        if (!item) {
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        if (item.photoPath) {
            await (0, multer_util_1.deleteUploadedFile)('items', item.photoPath);
        }
        await this.itemsRepo.remove(id);
    }
    async getUpcoming(query) {
        const candidates = await this.itemsRepo.findUpcomingCandidates(query.carId, query.search);
        const now = Date.now();
        const evaluatedList = [];
        for (const item of candidates) {
            if (!item.car)
                continue;
            const currentKm = Number(item.car.currentKm || 0);
            const nextKm = item.nextMaintenanceKm !== null && item.nextMaintenanceKm !== undefined
                ? Number(item.nextMaintenanceKm)
                : null;
            const remainingKm = nextKm !== null ? nextKm - currentKm : null;
            let remainingDays = null;
            let nextDate = null;
            if (item.nextMaintenanceDate) {
                nextDate = new Date(item.nextMaintenanceDate);
                remainingDays = Math.ceil((nextDate.getTime() - now) / (1000 * 60 * 60 * 24));
            }
            let status = 'OK';
            const isOverdue = (remainingKm !== null && remainingKm <= 0) ||
                (remainingDays !== null && remainingDays <= 0);
            const isDueSoon = (remainingKm !== null && remainingKm <= 1000) ||
                (remainingDays !== null && remainingDays <= 30);
            const isUpcoming = (remainingKm !== null && remainingKm <= 2500) ||
                (remainingDays !== null && remainingDays <= 60);
            if (isOverdue) {
                status = 'OVERDUE';
            }
            else if (isDueSoon) {
                status = 'DUE_SOON';
            }
            else if (isUpcoming) {
                status = 'UPCOMING';
            }
            const scope = query.scope || query_upcoming_item_dto_1.UpcomingScope.DUE_SOON_OR_OVERDUE;
            let matchesScope = false;
            switch (scope) {
                case query_upcoming_item_dto_1.UpcomingScope.OVERDUE_ONLY:
                    matchesScope = status === 'OVERDUE';
                    break;
                case query_upcoming_item_dto_1.UpcomingScope.WITHIN_1K_KM:
                    matchesScope = remainingKm !== null && remainingKm <= 1000;
                    break;
                case query_upcoming_item_dto_1.UpcomingScope.WITHIN_30_DAYS:
                    matchesScope = remainingDays !== null && remainingDays <= 30;
                    break;
                case query_upcoming_item_dto_1.UpcomingScope.ALL:
                    matchesScope = true;
                    break;
                case query_upcoming_item_dto_1.UpcomingScope.DUE_SOON_OR_OVERDUE:
                default:
                    matchesScope = status === 'OVERDUE' || status === 'DUE_SOON';
                    break;
            }
            if (matchesScope) {
                const carSummary = (0, class_transformer_1.plainToInstance)(upcoming_item_serializer_1.UpcomingCarSummarySerializer, {
                    id: item.car.id,
                    brand: item.car.brand,
                    model: item.car.model,
                    plateNumber: item.car.plateNumber,
                    currentKm: item.car.currentKm,
                });
                const serializer = (0, class_transformer_1.plainToInstance)(upcoming_item_serializer_1.UpcomingItemSerializer, {
                    id: item.id,
                    carId: item.carId,
                    name: item.name,
                    description: item.description,
                    manufacturer: item.manufacturer,
                    photoPath: item.photoPath,
                    installedDate: item.installedDate,
                    installedKm: item.installedKm,
                    expectedMaintenanceKm: item.expectedMaintenanceKm,
                    expectedMaintenanceMonths: item.expectedMaintenanceMonths,
                    lastMaintenanceDate: item.lastMaintenanceDate,
                    nextMaintenanceKm: nextKm,
                    nextMaintenanceDate: nextDate,
                    currentKm,
                    remainingKm,
                    remainingDays,
                    status,
                    car: carSummary,
                });
                evaluatedList.push(serializer);
            }
        }
        const statusWeight = {
            OVERDUE: 1,
            DUE_SOON: 2,
            UPCOMING: 3,
            OK: 4,
        };
        const order = query.order && query.order.toString().toUpperCase() === 'DESC'
            ? 'DESC'
            : 'ASC';
        evaluatedList.sort((a, b) => {
            if (query.sortBy) {
                let valA = a[query.sortBy];
                let valB = b[query.sortBy];
                if (query.sortBy === 'car') {
                    valA = a.car?.brand || '';
                    valB = b.car?.brand || '';
                }
                if (valA === null || valA === undefined)
                    valA = 9999999;
                if (valB === null || valB === undefined)
                    valB = 9999999;
                if (valA < valB)
                    return order === 'ASC' ? -1 : 1;
                if (valA > valB)
                    return order === 'ASC' ? 1 : -1;
                return 0;
            }
            const weightA = statusWeight[a.status] || 5;
            const weightB = statusWeight[b.status] || 5;
            if (weightA !== weightB) {
                return weightA - weightB;
            }
            const rKmA = a.remainingKm !== null && a.remainingKm !== undefined
                ? a.remainingKm
                : 9999999;
            const rKmB = b.remainingKm !== null && b.remainingKm !== undefined
                ? b.remainingKm
                : 9999999;
            if (rKmA !== rKmB) {
                return rKmA - rKmB;
            }
            const rDaysA = a.remainingDays !== null && a.remainingDays !== undefined
                ? a.remainingDays
                : 9999999;
            const rDaysB = b.remainingDays !== null && b.remainingDays !== undefined
                ? b.remainingDays
                : 9999999;
            return rDaysA - rDaysB;
        });
        const page = query.page && query.page > 0 ? query.page : 1;
        const limit = query.limit && query.limit > 0 ? query.limit : 10;
        const totalItems = evaluatedList.length;
        const paged = evaluatedList.slice((page - 1) * limit, page * limit);
        const pageMetaDto = new page_meta_dto_1.PageMetaDto({
            itemCount: totalItems,
            pageOptionsDto: query,
        });
        return new page_dto_1.PageDto(paged, pageMetaDto);
    }
};
exports.ItemsService = ItemsService;
exports.ItemsService = ItemsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [items_repository_1.ItemsRepository,
        cars_repository_1.CarsRepository,
        maintenance_records_repository_1.MaintenanceRecordsRepository])
], ItemsService);
//# sourceMappingURL=items.service.js.map