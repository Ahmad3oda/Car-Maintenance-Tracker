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
exports.ItemsRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const item_entity_1 = require("./entities/item.entity");
let ItemsRepository = class ItemsRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async create(item) {
        const newItem = this.repo.create(item);
        return this.repo.save(newItem);
    }
    async findAll(page = 1, limit = 10, search, sortBy, order = 'ASC', carId) {
        const query = this.repo
            .createQueryBuilder('item')
            .leftJoinAndSelect('item.maintenanceRecords', 'maintenanceRecords');
        if (carId) {
            query.andWhere('item.carId = :carId', { carId });
        }
        if (search) {
            query.andWhere('item.name LIKE :search OR item.description LIKE :search OR item.manufacturer LIKE :search', {
                search: `%${search}%`,
            });
        }
        if (sortBy) {
            query.orderBy(`item.${sortBy}`, order);
        }
        else {
            query.orderBy('item.createdAt', order);
        }
        query.skip((page - 1) * limit).take(limit);
        return query.getManyAndCount();
    }
    async findOne(id) {
        return this.repo.findOne({
            where: { id },
            relations: ['car', 'maintenanceRecords'],
        });
    }
    async update(id, item) {
        await this.repo.update(id, item);
        return this.findOne(id);
    }
    async remove(id) {
        await this.repo.delete(id);
    }
    async save(item) {
        return this.repo.save(item);
    }
};
exports.ItemsRepository = ItemsRepository;
exports.ItemsRepository = ItemsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(item_entity_1.Item)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ItemsRepository);
//# sourceMappingURL=items.repository.js.map