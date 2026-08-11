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
const item_serializer_1 = require("./serializers/item.serializer");
const page_dto_1 = require("../../common/dtos/page.dto");
const page_meta_dto_1 = require("../../common/dtos/page-meta.dto");
const class_transformer_1 = require("class-transformer");
const multer_util_1 = require("../../common/utils/multer.util");
let ItemsService = class ItemsService {
    itemsRepo;
    carsRepo;
    constructor(itemsRepo, carsRepo) {
        this.itemsRepo = itemsRepo;
        this.carsRepo = carsRepo;
    }
    async create(dto, photo) {
        const car = await this.carsRepo.findOne(dto.carId);
        if (!car) {
            if (photo) {
                await (0, multer_util_1.deleteUploadedFile)('items', photo);
            }
            throw new common_1.NotFoundException(`Car with ID ${dto.carId} not found`);
        }
        const itemData = {
            ...dto,
            photoPath: photo ?? null,
        };
        const savedItem = await this.itemsRepo.create(itemData);
        return (0, class_transformer_1.plainToInstance)(item_serializer_1.ItemSerializer, savedItem);
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
        if (dto.carId && dto.carId !== item.carId) {
            const car = await this.carsRepo.findOne(dto.carId);
            if (!car) {
                if (photo) {
                    await (0, multer_util_1.deleteUploadedFile)('items', photo);
                }
                throw new common_1.NotFoundException(`Car with ID ${dto.carId} not found`);
            }
        }
        const updateData = { ...dto };
        if (photo) {
            if (item.photoPath) {
                await (0, multer_util_1.deleteUploadedFile)('items', item.photoPath);
            }
            updateData.photoPath = photo;
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
};
exports.ItemsService = ItemsService;
exports.ItemsService = ItemsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [items_repository_1.ItemsRepository,
        cars_repository_1.CarsRepository])
], ItemsService);
//# sourceMappingURL=items.service.js.map