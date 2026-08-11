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
exports.MaintenanceRecordsRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const maintenance_record_entity_1 = require("./entities/maintenance-record.entity");
let MaintenanceRecordsRepository = class MaintenanceRecordsRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async create(record) {
        const newRecord = this.repo.create(record);
        return this.repo.save(newRecord);
    }
    async findAll(page = 1, limit = 10, search, sortBy, order = 'ASC', carId, itemId) {
        const query = this.repo
            .createQueryBuilder('record')
            .leftJoinAndSelect('record.car', 'car')
            .leftJoinAndSelect('record.item', 'item');
        if (carId) {
            query.andWhere('record.carId = :carId', { carId });
        }
        if (itemId) {
            query.andWhere('record.itemId = :itemId', { itemId });
        }
        if (search) {
            query.andWhere('record.notes LIKE :search', { search: `%${search}%` });
        }
        const sortField = sortBy || 'maintenanceDate';
        const sortOrder = order || 'DESC';
        query.orderBy(`record.${sortField}`, sortOrder);
        query.skip((page - 1) * limit).take(limit);
        return query.getManyAndCount();
    }
    async findOne(id) {
        return this.repo.findOne({
            where: { id },
            relations: ['car', 'item'],
        });
    }
    async update(id, record) {
        await this.repo.update(id, record);
        return this.findOne(id);
    }
    async remove(id) {
        await this.repo.delete(id);
    }
};
exports.MaintenanceRecordsRepository = MaintenanceRecordsRepository;
exports.MaintenanceRecordsRepository = MaintenanceRecordsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(maintenance_record_entity_1.MaintenanceRecord)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MaintenanceRecordsRepository);
//# sourceMappingURL=maintenance-records.repository.js.map