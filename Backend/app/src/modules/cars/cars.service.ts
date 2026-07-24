import { Injectable, NotFoundException } from '@nestjs/common';
import { CarsRepository } from './cars.repository';
import { CreateCarDto } from './dtos/create-car.dto';
import { UpdateCarDto } from './dtos/update-car.dto';
import { QueryCarDto } from './dtos/query-car.dto';
import { CarSerializer } from './serializers/car.serializer';
import { PageDto } from '../../common/dtos/page.dto';
import { PageMetaDto } from '../../common/dtos/page-meta.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CarsService {
  constructor(private readonly carsRepo: CarsRepository) {}

  async create(dto: CreateCarDto): Promise<CarSerializer> {
    const car = await this.carsRepo.create(dto);
    return plainToInstance(CarSerializer, car);
  }

  async findAll(query: QueryCarDto): Promise<PageDto<CarSerializer>> {
    const [cars, itemCount] = await this.carsRepo.findAll(
      query.page,
      query.limit,
      query.search,
      query.sortBy,
      query.order,
    );

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: query });
    const serializedCars = cars.map((car) =>
      plainToInstance(CarSerializer, car),
    );

    return new PageDto(serializedCars, pageMetaDto);
  }

  async findOne(id: number): Promise<CarSerializer> {
    const car = await this.carsRepo.findOne(id);
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
    return plainToInstance(CarSerializer, car);
  }

  async update(id: number, dto: UpdateCarDto): Promise<CarSerializer> {
    const car = await this.carsRepo.findOne(id);
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
    const updatedCar = await this.carsRepo.update(id, dto);
    return plainToInstance(CarSerializer, updatedCar);
  }

  async remove(id: number): Promise<void> {
    const car = await this.carsRepo.findOne(id);
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
    await this.carsRepo.remove(id);
  }
}
