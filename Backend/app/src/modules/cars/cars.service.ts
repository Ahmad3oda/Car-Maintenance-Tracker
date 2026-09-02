import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CarsRepository } from './cars.repository';
import { CreateCarDto } from './dtos/create-car.dto';
import { UpdateCarDto } from './dtos/update-car.dto';
import { QueryCarDto } from './dtos/query-car.dto';
import {
  ExportCarDataDto,
  ImportCarDataDto,
  ImportResultDto,
} from './dtos/import-export.dto';
import { Item } from '../items/entities/item.entity';
import { MaintenanceRecord } from '../maintenance-records/entities/maintenance-record.entity';
import { CarSerializer } from './serializers/car.serializer';
import { PageDto } from '../../common/dtos/page.dto';
import { PageMetaDto } from '../../common/dtos/page-meta.dto';
import { plainToInstance } from 'class-transformer';
import { deleteUploadedFile } from '../../common/utils/multer.util';

@Injectable()
export class CarsService {
  constructor(
    private readonly carsRepo: CarsRepository,
    private readonly dataSource: DataSource,
  ) {}

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

  async exportCarData(id: number): Promise<ExportCarDataDto> {
    const car = await this.carsRepo.findOne(id);
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }

    const items = await this.dataSource.getRepository(Item).find({
      where: { carId: id },
      relations: ['maintenanceRecords'],
      order: { createdAt: 'ASC' },
    });

    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      car: {
        plateNumber: car.plateNumber,
        brand: car.brand,
        model: car.model,
        year: car.year,
        currentKm: car.currentKm,
      },
      items: items.map((item) => {
        const sortedRecords = (item.maintenanceRecords || []).sort(
          (a, b) =>
            new Date(a.maintenanceDate).getTime() -
            new Date(b.maintenanceDate).getTime(),
        );

        return {
          name: item.name,
          description: item.description || null,
          manufacturer: item.manufacturer || null,
          installedDate: item.installedDate
            ? new Date(item.installedDate).toISOString()
            : null,
          installedKm: item.installedKm,
          expectedMaintenanceKm: item.expectedMaintenanceKm,
          expectedMaintenanceMonths: item.expectedMaintenanceMonths,
          events: sortedRecords.map((rec) => ({
            maintenanceDate: new Date(rec.maintenanceDate).toISOString(),
            kmCounter: rec.kmCounter,
            itemCost: rec.itemCost,
            extraCosts: rec.extraCosts || null,
            notes: rec.notes || null,
          })),
        };
      }),
    };
  }

  async importCarData(
    carId: number,
    dto: ImportCarDataDto,
  ): Promise<ImportResultDto> {
    const car = await this.carsRepo.findOne(carId);
    if (!car) {
      throw new NotFoundException(`Car with ID ${carId} not found`);
    }

    if (!dto.items || !Array.isArray(dto.items) || dto.items.length === 0) {
      throw new BadRequestException('No items found in import data');
    }

    let totalItemsCount = 0;
    let totalEventsCount = 0;

    await this.dataSource.transaction(async (manager) => {
      for (const itemDto of dto.items) {
        if (!itemDto.name) continue;

        const installedKm =
          itemDto.installedKm !== undefined && itemDto.installedKm !== null
            ? Number(itemDto.installedKm)
            : Number(car.currentKm || 0);

        const installedDate = itemDto.installedDate
          ? new Date(itemDto.installedDate)
          : new Date();

        let nextMaintenanceKm: number | null = null;
        if (itemDto.expectedMaintenanceKm) {
          nextMaintenanceKm = installedKm + Number(itemDto.expectedMaintenanceKm);
        }

        let nextMaintenanceDate: Date | null = null;
        if (itemDto.expectedMaintenanceMonths) {
          const d = new Date(installedDate);
          d.setMonth(d.getMonth() + Number(itemDto.expectedMaintenanceMonths));
          nextMaintenanceDate = d;
        }

        const itemEntity = manager.getRepository(Item).create({
          carId,
          name: itemDto.name,
          description: itemDto.description || undefined,
          manufacturer: itemDto.manufacturer || undefined,
          installedDate,
          installedKm,
          expectedMaintenanceKm: itemDto.expectedMaintenanceKm
            ? Number(itemDto.expectedMaintenanceKm)
            : undefined,
          expectedMaintenanceMonths: itemDto.expectedMaintenanceMonths
            ? Number(itemDto.expectedMaintenanceMonths)
            : undefined,
          nextMaintenanceKm: nextMaintenanceKm || undefined,
          nextMaintenanceDate: nextMaintenanceDate || undefined,
        });

        const savedItem = await manager.save(Item, itemEntity);
        totalItemsCount++;

        const events = itemDto.events || [];
        if (events.length > 0) {
          const sortedEvents = [...events].sort(
            (a, b) =>
              new Date(a.maintenanceDate).getTime() -
              new Date(b.maintenanceDate).getTime(),
          );

          let lastRecord: MaintenanceRecord | null = null;

          for (const eventDto of sortedEvents) {
            const eventDate = new Date(eventDto.maintenanceDate);
            const eventKm = Number(eventDto.kmCounter || 0);
            const itemCost = Number(eventDto.itemCost || 0);

            const recordEntity = manager
              .getRepository(MaintenanceRecord)
              .create({
                carId,
                itemId: savedItem.id,
                maintenanceDate: eventDate,
                kmCounter: eventKm,
                itemCost,
                extraCosts: eventDto.extraCosts || undefined,
                notes: eventDto.notes || undefined,
              });

            lastRecord = await manager.save(MaintenanceRecord, recordEntity);
            totalEventsCount++;
          }

          if (lastRecord) {
            let finalNextKm: number | null = null;
            if (savedItem.expectedMaintenanceKm) {
              finalNextKm =
                lastRecord.kmCounter + Number(savedItem.expectedMaintenanceKm);
            }

            let finalNextDate: Date | null = null;
            if (savedItem.expectedMaintenanceMonths) {
              const d = new Date(lastRecord.maintenanceDate);
              d.setMonth(
                d.getMonth() + Number(savedItem.expectedMaintenanceMonths),
              );
              finalNextDate = d;
            }

            await manager.update(Item, savedItem.id, {
              lastMaintenanceId: lastRecord.id,
              lastMaintenanceDate: lastRecord.maintenanceDate,
              nextMaintenanceKm: finalNextKm,
              nextMaintenanceDate: finalNextDate,
            });
          }
        } else {
          const initialRecord = manager
            .getRepository(MaintenanceRecord)
            .create({
              carId,
              itemId: savedItem.id,
              maintenanceDate: installedDate,
              kmCounter: installedKm,
              itemCost: 0,
              notes: 'Initial component installation',
            });
          const savedInitial = await manager.save(
            MaintenanceRecord,
            initialRecord,
          );
          totalEventsCount++;

          await manager.update(Item, savedItem.id, {
            lastMaintenanceId: savedInitial.id,
            lastMaintenanceDate: installedDate,
          });
        }
      }
    });

    return {
      success: true,
      importedItems: totalItemsCount,
      importedEvents: totalEventsCount,
      message: `Successfully imported ${totalItemsCount} item${totalItemsCount === 1 ? '' : 's'} and ${totalEventsCount} maintenance record${totalEventsCount === 1 ? '' : 's'}.`,
    };
  }
}
