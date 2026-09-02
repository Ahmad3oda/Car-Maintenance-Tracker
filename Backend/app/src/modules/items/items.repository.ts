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
    order: 'ASC' | 'DESC' = 'DESC',
    carId?: number,
  ): Promise<[Item[], number]> {
    const query = this.repo
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.car', 'car')
      .leftJoinAndSelect('item.maintenanceRecords', 'maintenanceRecords');

    if (carId) {
      query.andWhere('item.carId = :carId', { carId });
    }

    if (search) {
      query.andWhere(
        '(item.name LIKE :search OR item.description LIKE :search OR item.manufacturer LIKE :search OR car.brand LIKE :search OR car.model LIKE :search OR car.plateNumber LIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    const sortOrder: 'ASC' | 'DESC' =
      order && order.toString().toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    if (sortBy === 'name') {
      query.orderBy('item.name', sortOrder);
    } else if (sortBy === 'installedKm') {
      query.orderBy('item.installedKm', sortOrder).addOrderBy('item.id', 'DESC');
    } else if (sortBy === 'nextMaintenanceKm') {
      query.orderBy('item.nextMaintenanceKm', sortOrder).addOrderBy('item.id', 'DESC');
    } else if (
      sortBy === 'lastInstallment' ||
      sortBy === 'lastMaintenanceDate' ||
      sortBy === 'installedDate'
    ) {
      query
        .orderBy('item.lastMaintenanceDate', sortOrder)
        .addOrderBy('item.installedDate', sortOrder)
        .addOrderBy('item.id', 'DESC');
    } else if (sortBy === 'manufacturer') {
      query.orderBy('item.manufacturer', sortOrder);
    } else if (sortBy === 'updatedAt') {
      query.orderBy('item.updatedAt', sortOrder);
    } else {
      query.orderBy('item.createdAt', 'DESC');
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

  async findUpcomingCandidates(
    carId?: number,
    search?: string,
  ): Promise<Item[]> {
    const query = this.repo
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.car', 'car')
      .leftJoinAndSelect('item.maintenanceRecords', 'maintenanceRecords')
      .where(
        '(item.nextMaintenanceKm IS NOT NULL OR item.nextMaintenanceDate IS NOT NULL)',
      );

    if (carId) {
      query.andWhere('item.carId = :carId', { carId });
    }

    if (search) {
      query.andWhere(
        '(item.name LIKE :search OR item.description LIKE :search OR item.manufacturer LIKE :search OR car.brand LIKE :search OR car.model LIKE :search OR car.plateNumber LIKE :search)',
        { search: `%${search}%` },
      );
    }

    return query.getMany();
  }
}
