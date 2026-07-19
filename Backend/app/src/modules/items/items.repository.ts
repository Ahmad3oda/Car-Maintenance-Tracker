import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsRepository {
  constructor(
    @InjectRepository(Item)
    private readonly repo: Repository<Item>,
  ) {}

  async create(item: Partial<Item>): Promise<Item> {
    const newItem = this.repo.create(item);
    return this.repo.save(newItem);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy?: string,
    order: 'ASC' | 'DESC' = 'ASC',
    carId?: number,
  ): Promise<[Item[], number]> {
    const query = this.repo.createQueryBuilder('item');

    if (carId) {
      query.andWhere('item.carId = :carId', { carId });
    }

    if (search) {
      query.andWhere('item.name LIKE :search OR item.description LIKE :search OR item.serialNumber LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (sortBy) {
      query.orderBy(`item.${sortBy}`, order);
    } else {
      query.orderBy('item.createdAt', order);
    }

    query.skip((page - 1) * limit).take(limit);

    return query.getManyAndCount();
  }

  async findOne(id: number): Promise<Item | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['car', 'maintenanceRecords'],
    });
  }

  async update(id: number, item: Partial<Item>): Promise<Item | null> {
    await this.repo.update(id, item);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async save(item: Item): Promise<Item> {
    return this.repo.save(item);
  }
}
