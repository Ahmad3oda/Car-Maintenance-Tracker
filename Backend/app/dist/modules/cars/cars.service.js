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
const cars_repository_1 = require("./cars.repository");
const car_serializer_1 = require("./serializers/car.serializer");
const page_dto_1 = require("../../common/dtos/page.dto");
const page_meta_dto_1 = require("../../common/dtos/page-meta.dto");
const class_transformer_1 = require("class-transformer");
const fs_1 = require("fs");
let CarsService = class CarsService {
    carsRepo;
    constructor(carsRepo) {
        this.carsRepo = carsRepo;
    }
    async create(dto, photo) {
        console.log(photo);
        const dbCar = await this.carsRepo.findOneByPlate(dto.plateNumber);
        if (dbCar) {
            if (photo) {
                await fs_1.promises.unlink(`uploads\\cars\\${photo.filename}`).catch(() => { });
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
            throw new common_1.NotFoundException(`Car with ID ${id} not found`);
        }
        if (photo && car.photoPath) {
            await fs_1.promises.unlink(`uploads\\cars\\${car.photoPath}`).catch(() => { });
        }
        const updatedCar = await this.carsRepo.update(id, {
            ...dto,
            photoPath: photo?.filename ?? null,
        });
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
            await fs_1.promises.unlink(`uploads\\cars\\${car.photoPath}`).catch(() => { });
        }
        await this.carsRepo.remove(id);
    }
};
exports.CarsService = CarsService;
exports.CarsService = CarsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cars_repository_1.CarsRepository])
], CarsService);
//# sourceMappingURL=cars.service.js.map