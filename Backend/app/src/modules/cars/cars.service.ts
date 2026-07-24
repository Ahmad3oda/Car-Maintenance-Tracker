import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CarsRepository } from './cars.repository';
import { CreateCarDto } from './dtos/create-car.dto';
import { UpdateCarDto } from './dtos/update-car.dto';
import { QueryCarDto } from './dtos/query-car.dto';
import { CarSerializer } from './serializers/car.serializer';
import { PageDto } from '../../common/dtos/page.dto';
import { PageMetaDto } from '../../common/dtos/page-meta.dto';
import { plainToInstance } from 'class-transformer';
import { promises as fs } from 'fs';

@Injectable()
export class CarsService {
  constructor(private readonly carsRepo: CarsRepository) {}

  async create(
    dto: CreateCarDto,
    photo?: Express.Multer.File,
  ): Promise<CarSerializer> {
    console.log(photo);

    const dbCar = await this.carsRepo.findOneByPlate(dto.plateNumber);
    if (dbCar) {
      if (photo) {
        await fs.unlink(`uploads\\cars\\${photo.filename}`).catch(() => {});
      }
      throw new BadRequestException(
        `Car with plate number ${dto.plateNumber} is already registered`,
      );
    }

    const car = await this.carsRepo.create({
      ...dto,
      photoPath: photo?.filename ?? null,
    });
    return car;
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
    return car;
  }

  async update(
    id: number,
    dto: UpdateCarDto,
    photo?: Express.Multer.File,
  ): Promise<CarSerializer> {
    const car = await this.carsRepo.findOne(id);
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
    if (photo && car.photoPath) {
      await fs.unlink(`uploads\\cars\\${car.photoPath}`).catch(() => {});
    }

    const updatedCar = await this.carsRepo.update(id, {
      ...dto,
      photoPath: photo?.filename ?? null,
    });

    if (!updatedCar) {
      throw new BadRequestException(`Failed to update car with ID ${id}`);
    }
    return updatedCar;
  }

  async remove(id: number): Promise<void> {
    const car = await this.carsRepo.findOne(id);
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }
    if (car.photoPath) {
      await fs.unlink(`uploads\\cars\\${car.photoPath}`).catch(() => {});
    }
    await this.carsRepo.remove(id);
  }
}
