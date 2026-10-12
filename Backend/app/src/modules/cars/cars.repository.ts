import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';

@Injectable()
export class CarsRepository {
  constructor(
    @InjectRepository(Car)
    private readonly repo: Repository<Car>,
  ) {}

  async create(car: Partial<Car>): Promise<Car> {
    const newCar = this.repo.create(car);
    return this.repo.save(newCar);
  }

  /** Every query is scoped to the owner; other users' cars do not exist. */
  async findAll(
    userId: number,
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy?: string,
    order: 'ASC' | 'DESC' = 'DESC',
  ): Promise<[Car[], number]> {
    const query = this.repo
      .createQueryBuilder('car')
      .where('car.userId = :userId', { userId });

    if (search) {
      // Parenthesized so the OR cannot escape the owner filter.
      query.andWhere(
        '(car.plateNumber LIKE :search OR car.brand LIKE :search OR car.model LIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    const sortOrder: 'ASC' | 'DESC' =
      order && order.toString().toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    if (sortBy === 'brand') {
      query.orderBy('car.brand', sortOrder);
    } else if (sortBy === 'model') {
      query.orderBy('car.model', sortOrder);
    } else if (sortBy === 'year') {
      query.orderBy('car.year', sortOrder);
    } else if (sortBy === 'currentKm') {
      query.orderBy('car.currentKm', sortOrder);
    } else if (sortBy === 'plateNumber') {
      query.orderBy('car.plateNumber', sortOrder);
    } else if (sortBy === 'updatedAt') {
      query.orderBy('car.updatedAt', sortOrder);
    } else {
      query.orderBy('car.createdAt', 'DESC');
    }

    query.skip((page - 1) * limit).take(limit);

    return query.getManyAndCount();
  }

  async findOne(id: number, userId: number): Promise<Car | null> {
    return this.repo.findOne({
      where: { id, userId },
      relations: ['items', 'maintenanceRecords'],
    });
  }

  /** Plates are unique across all users (see Car.plateNumber). */
  async findOneByPlate(plateNumber: string): Promise<Car | null> {
    return this.repo.findOne({
      where: { plateNumber },
    });
  }

  async update(
    id: number,
    userId: number,
    car: Partial<Car>,
  ): Promise<Car | null> {
    await this.repo.update({ id, userId }, car);
    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.repo.delete({ id, userId });
  }
}
