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

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy?: string,
    order: 'ASC' | 'DESC' = 'DESC',
  ): Promise<[Car[], number]> {
    const query = this.repo.createQueryBuilder('car');

    if (search) {
      query.where(
        'car.plateNumber LIKE :search OR car.brand LIKE :search OR car.model LIKE :search',
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

  async findOne(id: number): Promise<Car | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['items', 'maintenanceRecords'],
    });
  }

  async findOneByPlate(plateNumber: string): Promise<Car | null> {
    return this.repo.findOne({
      where: { plateNumber },
    });
  }

  async update(id: number, car: Partial<Car>): Promise<Car | null> {
    await this.repo.update(id, car);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
