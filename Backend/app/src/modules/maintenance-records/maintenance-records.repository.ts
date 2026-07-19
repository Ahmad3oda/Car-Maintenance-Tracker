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

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy?: string,
    order: 'ASC' | 'DESC' = 'ASC',
    carId?: number,
    itemId?: number,
  ): Promise<[MaintenanceRecord[], number]> {
    const query = this.repo.createQueryBuilder('record');

    if (carId) {
      query.andWhere('record.carId = :carId', { carId });
    }

    if (itemId) {
      query.andWhere('record.itemId = :itemId', { itemId });
    }

    if (search) {
      query.andWhere('record.notes LIKE :search', { search: `%${search}%` });
    }

    if (sortBy) {
      query.orderBy(`record.${sortBy}`, order);
    } else {
      query.orderBy('record.maintenanceDate', order);
    }

    query.skip((page - 1) * limit).take(limit);

    return query.getManyAndCount();
  }

  async findOne(id: number): Promise<MaintenanceRecord | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['car', 'item'],
    });
  }

  async update(id: number, record: Partial<MaintenanceRecord>): Promise<MaintenanceRecord | null> {
    await this.repo.update(id, record);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
