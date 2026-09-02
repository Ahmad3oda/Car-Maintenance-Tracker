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
exports.CarsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const cars_repository_1 = require("./cars.repository");
const item_entity_1 = require("../items/entities/item.entity");
const maintenance_record_entity_1 = require("../maintenance-records/entities/maintenance-record.entity");
const car_serializer_1 = require("./serializers/car.serializer");
const page_dto_1 = require("../../common/dtos/page.dto");
const page_meta_dto_1 = require("../../common/dtos/page-meta.dto");
const class_transformer_1 = require("class-transformer");
const multer_util_1 = require("../../common/utils/multer.util");
let CarsService = class CarsService {
    carsRepo;
    dataSource;
    constructor(carsRepo, dataSource) {
        this.carsRepo = carsRepo;
        this.dataSource = dataSource;
    }
    async create(dto, photo) {
        const dbCar = await this.carsRepo.findOneByPlate(dto.plateNumber);
        if (dbCar) {
            if (photo) {
                await (0, multer_util_1.deleteUploadedFile)('cars', photo.filename);
            }
            throw new common_1.BadRequestException(`Car with plate number ${dto.plateNumber} is already registered`);
        }
        const car = await this.carsRepo.create({
            ...dto,
            photoPath: photo?.filename ?? null,
        });
        return car;
    }
    async findAll(query) {
        const [cars, itemCount] = await this.carsRepo.findAll(query.page, query.limit, query.search, query.sortBy, query.order);
        const pageMetaDto = new page_meta_dto_1.PageMetaDto({ itemCount, pageOptionsDto: query });
        const serializedCars = cars.map((car) => (0, class_transformer_1.plainToInstance)(car_serializer_1.CarSerializer, car));
        return new page_dto_1.PageDto(serializedCars, pageMetaDto);
    }
    async findOne(id) {
        const car = await this.carsRepo.findOne(id);
        if (!car) {
            throw new common_1.NotFoundException(`Car with ID ${id} not found`);
        }
        return car;
    }
    async update(id, dto, photo) {
        const car = await this.carsRepo.findOne(id);
        if (!car) {
            if (photo) {
                await (0, multer_util_1.deleteUploadedFile)('cars', photo.filename);
            }
            throw new common_1.NotFoundException(`Car with ID ${id} not found`);
        }
        const updateData = { ...dto };
        if (photo) {
            if (car.photoPath) {
                await (0, multer_util_1.deleteUploadedFile)('cars', car.photoPath);
            }
            updateData.photoPath = photo.filename;
        }
        const updatedCar = await this.carsRepo.update(id, updateData);
        if (!updatedCar) {
            throw new common_1.BadRequestException(`Failed to update car with ID ${id}`);
        }
        return updatedCar;
    }
    async remove(id) {
        const car = await this.carsRepo.findOne(id);
        if (!car) {
            throw new common_1.NotFoundException(`Car with ID ${id} not found`);
        }
        if (car.photoPath) {
            await (0, multer_util_1.deleteUploadedFile)('cars', car.photoPath);
        }
        await this.carsRepo.remove(id);
    }
    async exportCarData(id) {
        const car = await this.carsRepo.findOne(id);
        if (!car) {
            throw new common_1.NotFoundException(`Car with ID ${id} not found`);
        }
        const items = await this.dataSource.getRepository(item_entity_1.Item).find({
            where: { carId: id },
            relations: ['maintenanceRecords'],
            order: { createdAt: 'ASC' },
        });
        return {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            car: {
                plateNumber: car.plateNumber,
                brand: car.brand,
                model: car.model,
                year: car.year,
                currentKm: car.currentKm,
            },
            items: items.map((item) => {
                const sortedRecords = (item.maintenanceRecords || []).sort((a, b) => new Date(a.maintenanceDate).getTime() -
                    new Date(b.maintenanceDate).getTime());
                return {
                    name: item.name,
                    description: item.description || null,
                    manufacturer: item.manufacturer || null,
                    installedDate: item.installedDate
                        ? new Date(item.installedDate).toISOString()
                        : null,
                    installedKm: item.installedKm,
                    expectedMaintenanceKm: item.expectedMaintenanceKm,
                    expectedMaintenanceMonths: item.expectedMaintenanceMonths,
                    events: sortedRecords.map((rec) => ({
                        maintenanceDate: new Date(rec.maintenanceDate).toISOString(),
                        kmCounter: rec.kmCounter,
                        itemCost: rec.itemCost,
                        extraCosts: rec.extraCosts || null,
                        notes: rec.notes || null,
                    })),
                };
            }),
        };
    }
    async importCarData(carId, dto) {
        const car = await this.carsRepo.findOne(carId);
        if (!car) {
            throw new common_1.NotFoundException(`Car with ID ${carId} not found`);
        }
        if (!dto.items || !Array.isArray(dto.items) || dto.items.length === 0) {
            throw new common_1.BadRequestException('No items found in import data');
        }
        let totalItemsCount = 0;
        let totalEventsCount = 0;
        await this.dataSource.transaction(async (manager) => {
            for (const itemDto of dto.items) {
                if (!itemDto.name)
                    continue;
                const installedKm = itemDto.installedKm !== undefined && itemDto.installedKm !== null
                    ? Number(itemDto.installedKm)
                    : Number(car.currentKm || 0);
                const installedDate = itemDto.installedDate
                    ? new Date(itemDto.installedDate)
                    : new Date();
                let nextMaintenanceKm = null;
                if (itemDto.expectedMaintenanceKm) {
                    nextMaintenanceKm = installedKm + Number(itemDto.expectedMaintenanceKm);
                }
                let nextMaintenanceDate = null;
                if (itemDto.expectedMaintenanceMonths) {
                    const d = new Date(installedDate);
                    d.setMonth(d.getMonth() + Number(itemDto.expectedMaintenanceMonths));
                    nextMaintenanceDate = d;
                }
                const itemEntity = manager.getRepository(item_entity_1.Item).create({
                    carId,
                    name: itemDto.name,
                    description: itemDto.description || undefined,
                    manufacturer: itemDto.manufacturer || undefined,
                    installedDate,
                    installedKm,
                    expectedMaintenanceKm: itemDto.expectedMaintenanceKm
                        ? Number(itemDto.expectedMaintenanceKm)
                        : undefined,
                    expectedMaintenanceMonths: itemDto.expectedMaintenanceMonths
                        ? Number(itemDto.expectedMaintenanceMonths)
                        : undefined,
                    nextMaintenanceKm: nextMaintenanceKm || undefined,
                    nextMaintenanceDate: nextMaintenanceDate || undefined,
                });
                const savedItem = await manager.save(item_entity_1.Item, itemEntity);
                totalItemsCount++;
                const events = itemDto.events || [];
                if (events.length > 0) {
                    const sortedEvents = [...events].sort((a, b) => new Date(a.maintenanceDate).getTime() -
                        new Date(b.maintenanceDate).getTime());
                    let lastRecord = null;
                    for (const eventDto of sortedEvents) {
                        const eventDate = new Date(eventDto.maintenanceDate);
                        const eventKm = Number(eventDto.kmCounter || 0);
                        const itemCost = Number(eventDto.itemCost || 0);
                        const recordEntity = manager
                            .getRepository(maintenance_record_entity_1.MaintenanceRecord)
                            .create({
                            carId,
                            itemId: savedItem.id,
                            maintenanceDate: eventDate,
                            kmCounter: eventKm,
                            itemCost,
                            extraCosts: eventDto.extraCosts || undefined,
                            notes: eventDto.notes || undefined,
                        });
                        lastRecord = await manager.save(maintenance_record_entity_1.MaintenanceRecord, recordEntity);
                        totalEventsCount++;
                    }
                    if (lastRecord) {
                        let finalNextKm = null;
                        if (savedItem.expectedMaintenanceKm) {
                            finalNextKm =
                                lastRecord.kmCounter + Number(savedItem.expectedMaintenanceKm);
                        }
                        let finalNextDate = null;
                        if (savedItem.expectedMaintenanceMonths) {
                            const d = new Date(lastRecord.maintenanceDate);
                            d.setMonth(d.getMonth() + Number(savedItem.expectedMaintenanceMonths));
                            finalNextDate = d;
                        }
                        await manager.update(item_entity_1.Item, savedItem.id, {
                            lastMaintenanceId: lastRecord.id,
                            lastMaintenanceDate: lastRecord.maintenanceDate,
                            nextMaintenanceKm: finalNextKm,
                            nextMaintenanceDate: finalNextDate,
                        });
                    }
                }
                else {
                    const initialRecord = manager
                        .getRepository(maintenance_record_entity_1.MaintenanceRecord)
                        .create({
                        carId,
                        itemId: savedItem.id,
                        maintenanceDate: installedDate,
                        kmCounter: installedKm,
                        itemCost: 0,
                        notes: 'Initial component installation',
                    });
                    const savedInitial = await manager.save(maintenance_record_entity_1.MaintenanceRecord, initialRecord);
                    totalEventsCount++;
                    await manager.update(item_entity_1.Item, savedItem.id, {
                        lastMaintenanceId: savedInitial.id,
                        lastMaintenanceDate: installedDate,
                    });
                }
            }
        });
        return {
            success: true,
            importedItems: totalItemsCount,
            importedEvents: totalEventsCount,
            message: `Successfully imported ${totalItemsCount} item${totalItemsCount === 1 ? '' : 's'} and ${totalEventsCount} maintenance record${totalEventsCount === 1 ? '' : 's'}.`,
        };
    }
};
exports.CarsService = CarsService;
exports.CarsService = CarsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cars_repository_1.CarsRepository,
        typeorm_1.DataSource])
], CarsService);
//# sourceMappingURL=cars.service.js.map