import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceRecord } from './entities/maintenance-record.entity';

@Injectable()
export class MaintenanceRecordsRepository {
  constructor(
    @InjectRepository(MaintenanceRecord)
    private readonly repo: Repository<MaintenanceRecord>,
  ) {}

  async create(record: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> {
    const newRecord = this.repo.create(record);
    return this.repo.save(newRecord);
  }

  /** Records belong to a user through their car. */
  async findAll(
    userId: number,
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy?: string,
    order: 'ASC' | 'DESC' = 'DESC',
    carId?: number,
    itemId?: number,
    startDate?: string,
    endDate?: string,
  ): Promise<[MaintenanceRecord[], number]> {
    const query = this.repo
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.car', 'car')
      .leftJoinAndSelect('record.item', 'item')
      .where('car.userId = :userId', { userId });

    if (carId) {
      query.andWhere('record.carId = :carId', { carId });
    }

    if (itemId) {
      query.andWhere('record.itemId = :itemId', { itemId });
    }

    if (startDate) {
      query.andWhere('record.maintenanceDate >= :startDate', {
        startDate: new Date(startDate),
      });
    }

    if (endDate) {
      query.andWhere('record.maintenanceDate <= :endDate', {
        endDate: new Date(endDate),
      });
    }

    if (search) {
      query.andWhere(
        '(record.notes LIKE :search OR item.name LIKE :search OR car.brand LIKE :search OR car.model LIKE :search OR car.plateNumber LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const sortOrder: 'ASC' | 'DESC' =
      order && order.toString().toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    if (sortBy === 'totalCost' || sortBy === 'itemCost') {
      query
        .orderBy('record.itemCost', sortOrder)
        .addOrderBy('record.id', 'DESC');
    } else if (sortBy === 'date' || sortBy === 'maintenanceDate') {
      query
        .orderBy('record.maintenanceDate', sortOrder)
        .addOrderBy('record.kmCounter', sortOrder)
        .addOrderBy('record.id', sortOrder);
    } else if (sortBy === 'kmCounter') {
      query
        .orderBy('record.kmCounter', sortOrder)
        .addOrderBy('record.id', 'DESC');
    } else if (sortBy === 'updatedAt') {
      query
        .orderBy('record.updatedAt', sortOrder)
        .addOrderBy('record.id', 'DESC');
    } else {
      query
        .orderBy('record.maintenanceDate', 'DESC')
        .addOrderBy('record.kmCounter', 'DESC')
        .addOrderBy('record.id', 'DESC');
    }

    query.skip((page - 1) * limit).take(limit);

    return query.getManyAndCount();
  }

  async findOne(id: number, userId: number): Promise<MaintenanceRecord | null> {
    return this.repo.findOne({
      where: { id, car: { userId } },
      relations: ['car', 'item'],
    });
  }

  /** Callers must have checked ownership (findOne) first. */
  async update(id: number, record: Partial<MaintenanceRecord>): Promise<void> {
    await this.repo.update(id, record);
  }

  /** Callers must have checked ownership (findOne) first. */
  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
