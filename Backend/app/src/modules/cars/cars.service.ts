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
import { deleteUploadedFile } from '../../common/utils/multer.util';

@Injectable()
export class CarsService {
  constructor(private readonly carsRepo: CarsRepository) {}

  async create(
    dto: CreateCarDto,
    photo?: Express.Multer.File,
  ): Promise<CarSerializer> {
    const dbCar = await this.carsRepo.findOneByPlate(dto.plateNumber);
    if (dbCar) {
      if (photo) {
        await deleteUploadedFile('cars', photo.filename);
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
      if (photo) {
        await deleteUploadedFile('cars', photo.filename);
      }
      throw new NotFoundException(`Car with ID ${id} not found`);
    }

    const updateData: Partial<any> = { ...dto };
    if (photo) {
      if (car.photoPath) {
        await deleteUploadedFile('cars', car.photoPath);
      }
      updateData.photoPath = photo.filename;
    }

    const updatedCar = await this.carsRepo.update(id, updateData);

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
      await deleteUploadedFile('cars', car.photoPath);
    }
    await this.carsRepo.remove(id);
  }
}
