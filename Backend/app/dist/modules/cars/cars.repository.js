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
exports.CarsRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const car_entity_1 = require("./entities/car.entity");
let CarsRepository = class CarsRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async create(car) {
        const newCar = this.repo.create(car);
        return this.repo.save(newCar);
    }
    async findAll(page = 1, limit = 10, search, sortBy, order = 'ASC') {
        const query = this.repo.createQueryBuilder('car');
        if (search) {
            query.where('car.plateNumber LIKE :search OR car.brand LIKE :search OR car.model LIKE :search', {
                search: `%${search}%`,
            });
        }
        if (sortBy) {
            query.orderBy(`car.${sortBy}`, order);
        }
        else {
            query.orderBy('car.createdAt', order);
        }
        query.skip((page - 1) * limit).take(limit);
        return query.getManyAndCount();
    }
    async findOne(id) {
        return this.repo.findOne({
            where: { id },
            relations: ['items', 'maintenanceRecords'],
        });
    }
    async update(id, car) {
        await this.repo.update(id, car);
        return this.findOne(id);
    }
    async remove(id) {
        await this.repo.delete(id);
    }
};
exports.CarsRepository = CarsRepository;
exports.CarsRepository = CarsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(car_entity_1.Car)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CarsRepository);
//# sourceMappingURL=cars.repository.js.map