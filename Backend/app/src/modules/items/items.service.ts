import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemsRepository } from './items.repository';
import { CarsRepository } from '../cars/cars.repository';
import { OdometerService } from '../cars/odometer.service';
import { CreateItemDto } from './dtos/create-item.dto';
import { UpdateItemDto } from './dtos/update-item.dto';
import { QueryItemDto } from './dtos/query-item.dto';
import {
  QueryUpcomingItemDto,
  UpcomingScope,
} from './dtos/query-upcoming-item.dto';
import { ItemSerializer } from './serializers/item.serializer';
import {
  UpcomingItemSerializer,
  UpcomingCarSummarySerializer,
} from './serializers/upcoming-item.serializer';
import { PageDto } from '../../common/dtos/page.dto';
import { PageMetaDto } from '../../common/dtos/page-meta.dto';
import { plainToInstance } from 'class-transformer';
import { deleteUploadedFile } from '../../common/utils/multer.util';
import { computeMaintenanceSchedule } from './maintenance-schedule.util';
import { DataSource } from 'typeorm';
import { Item } from './entities/item.entity';
import { MaintenanceRecord } from '../maintenance-records/entities/maintenance-record.entity';
import { INITIAL_INSTALLATION_NOTE } from '../maintenance-records/maintenance-records.constants';

@Injectable()
export class ItemsService {
  constructor(
    private readonly itemsRepo: ItemsRepository,
    private readonly carsRepo: CarsRepository,
    private readonly dataSource: DataSource,
    private readonly odometer: OdometerService,
  ) {}

  async create(dto: CreateItemDto, photo?: string): Promise<ItemSerializer> {
    const car = await this.carsRepo.findOne(dto.carId);
    if (!car) {
      if (photo) {
        await deleteUploadedFile('items', photo);
      }
      throw new NotFoundException(`Car with ID ${dto.carId} not found`);
    }

    const installedKm =
      dto.installedKm !== undefined && dto.installedKm !== null
        ? Number(dto.installedKm)
        : Number(car.currentKm || 0);

    const installedDate = dto.installedDate
      ? new Date(dto.installedDate)
      : new Date();

    // Item, its initial installation record and the schedule are written
    // together so a failure never leaves an item without a baseline record.
    const itemId = await this.dataSource
      .transaction(async (manager) => {
        const savedItem = await manager.save(
          manager.create(Item, {
            ...dto,
            installedKm,
            installedDate,
            photoPath: photo ?? null,
          }),
        );
        const initialRecord = await manager.save(
          manager.create(MaintenanceRecord, {
            carId: car.id,
            itemId: savedItem.id,
            maintenanceDate: installedDate,
            kmCounter: installedKm,
            itemCost: 0,
            notes: INITIAL_INSTALLATION_NOTE,
          }),
        );
        await manager.update(
          Item,
          savedItem.id,
          computeMaintenanceSchedule(savedItem, [initialRecord]),
        );
        return savedItem.id;
      })
      .catch(async (error: unknown) => {
        if (photo) {
          await deleteUploadedFile('items', photo);
        }
        throw error;
      });
    await this.odometer.sync(car.id);

    return plainToInstance(
      ItemSerializer,
      await this.itemsRepo.findOne(itemId),
    );
  }

  async findAll(query: QueryItemDto): Promise<PageDto<ItemSerializer>> {
    const [items, itemCount] = await this.itemsRepo.findAll(
      query.page,
      query.limit,
      query.search,
      query.sortBy,
      query.order,
      query.carId,
    );

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: query });
    const serializedItems = items.map((item) =>
      plainToInstance(ItemSerializer, item),
    );

    return new PageDto(serializedItems, pageMetaDto);
  }

  async findOne(id: number): Promise<ItemSerializer> {
    const item = await this.itemsRepo.findOne(id);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return plainToInstance(ItemSerializer, item);
  }

  async update(
    id: number,
    dto: UpdateItemDto,
    photo?: string,
  ): Promise<ItemSerializer> {
    const item = await this.itemsRepo.findOne(id);
    if (!item) {
      if (photo) {
        await deleteUploadedFile('items', photo);
      }
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    let targetCar = item.car;
    if (dto.carId && dto.carId !== item.carId) {
      const car = await this.carsRepo.findOne(dto.carId);
      if (!car) {
        if (photo) {
          await deleteUploadedFile('items', photo);
        }
        throw new NotFoundException(`Car with ID ${dto.carId} not found`);
      }
      targetCar = car;
    }

    const updateData: Partial<Item> = { ...dto };
    if (photo) {
      if (item.photoPath) {
        await deleteUploadedFile('items', item.photoPath);
      }
      updateData.photoPath = photo;
    }

    const expectedKm =
      dto.expectedMaintenanceKm !== undefined
        ? dto.expectedMaintenanceKm
        : item.expectedMaintenanceKm;
    const expectedMonths =
      dto.expectedMaintenanceMonths !== undefined
        ? dto.expectedMaintenanceMonths
        : item.expectedMaintenanceMonths;
    const intervalKm =
      expectedKm && Number(expectedKm) > 0 ? Number(expectedKm) : null;
    const intervalMonths =
      expectedMonths && Number(expectedMonths) > 0
        ? Number(expectedMonths)
        : null;
    updateData.expectedMaintenanceKm = intervalKm;
    updateData.expectedMaintenanceMonths = intervalMonths;

    const installedKm = dto.installedKm ?? item.installedKm;
    Object.assign(
      updateData,
      computeMaintenanceSchedule(
        {
          installedKm: installedKm ?? Number(targetCar?.currentKm || 0),
          installedDate: dto.installedDate ?? item.installedDate ?? new Date(),
          expectedMaintenanceKm: intervalKm,
          expectedMaintenanceMonths: intervalMonths,
        },
        item.maintenanceRecords,
      ),
    );

    // Records follow their item, so moving the item moves its history too.
    await this.dataSource.transaction(async (manager) => {
      await manager.update(Item, id, updateData);
      if (targetCar.id !== item.carId) {
        await manager.update(
          MaintenanceRecord,
          { itemId: id },
          { carId: targetCar.id },
        );
      }
    });

    if (targetCar.id !== item.carId) {
      await this.odometer.sync(targetCar.id);
      await this.odometer.sync(item.carId, highestKm(item.maintenanceRecords));
    }

    const updatedItem = await this.itemsRepo.findOne(id);
    return plainToInstance(ItemSerializer, updatedItem);
  }

  async remove(id: number): Promise<void> {
    const item = await this.itemsRepo.findOne(id);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    if (item.photoPath) {
      await deleteUploadedFile('items', item.photoPath);
    }

    await this.itemsRepo.remove(id);
    await this.odometer.sync(item.carId, highestKm(item.maintenanceRecords));
  }

  async getUpcoming(
    query: QueryUpcomingItemDto,
  ): Promise<PageDto<UpcomingItemSerializer>> {
    const candidates = await this.itemsRepo.findUpcomingCandidates(
      query.carId,
      query.search,
    );

    const now = Date.now();
    const evaluatedList: UpcomingItemSerializer[] = [];

    for (const item of candidates) {
      if (!item.car) continue;

      const currentKm = Number(item.car.currentKm || 0);
      const nextKm =
        item.nextMaintenanceKm !== null && item.nextMaintenanceKm !== undefined
          ? Number(item.nextMaintenanceKm)
          : null;
      const remainingKm = nextKm !== null ? nextKm - currentKm : null;

      let remainingDays: number | null = null;
      let nextDate: Date | null = null;
      if (item.nextMaintenanceDate) {
        nextDate = new Date(item.nextMaintenanceDate);
        remainingDays = Math.ceil(
          (nextDate.getTime() - now) / (1000 * 60 * 60 * 24),
        );
      }

      let status: 'OVERDUE' | 'DUE_SOON' | 'UPCOMING' | 'OK' = 'OK';
      const isOverdue =
        (remainingKm !== null && remainingKm <= 0) ||
        (remainingDays !== null && remainingDays <= 0);
      const isDueSoon =
        (remainingKm !== null && remainingKm <= 1000) ||
        (remainingDays !== null && remainingDays <= 30);
      const isUpcoming =
        (remainingKm !== null && remainingKm <= 2500) ||
        (remainingDays !== null && remainingDays <= 60);

      if (isOverdue) {
        status = 'OVERDUE';
      } else if (isDueSoon) {
        status = 'DUE_SOON';
      } else if (isUpcoming) {
        status = 'UPCOMING';
      }

      // Filter based on scope
      const scope = query.scope || UpcomingScope.DUE_SOON_OR_OVERDUE;
      let matchesScope = false;

      switch (scope) {
        case UpcomingScope.OVERDUE_ONLY:
          matchesScope = status === 'OVERDUE';
          break;
        case UpcomingScope.WITHIN_1K_KM:
          matchesScope = remainingKm !== null && remainingKm <= 1000;
          break;
        case UpcomingScope.WITHIN_30_DAYS:
          matchesScope = remainingDays !== null && remainingDays <= 30;
          break;
        case UpcomingScope.ALL:
          matchesScope = true;
          break;
        case UpcomingScope.DUE_SOON_OR_OVERDUE:
        default:
          matchesScope = status === 'OVERDUE' || status === 'DUE_SOON';
          break;
      }

      if (matchesScope) {
        const carSummary: UpcomingCarSummarySerializer = plainToInstance(
          UpcomingCarSummarySerializer,
          {
            id: item.car.id,
            brand: item.car.brand,
            model: item.car.model,
            plateNumber: item.car.plateNumber,
            currentKm: item.car.currentKm,
          },
        );

        const serializer = plainToInstance(UpcomingItemSerializer, {
          id: item.id,
          carId: item.carId,
          name: item.name,
          description: item.description,
          manufacturer: item.manufacturer,
          photoPath: item.photoPath,
          installedDate: item.installedDate,
          installedKm: item.installedKm,
          expectedMaintenanceKm: item.expectedMaintenanceKm,
          expectedMaintenanceMonths: item.expectedMaintenanceMonths,
          lastMaintenanceDate: item.lastMaintenanceDate,
          nextMaintenanceKm: nextKm,
          nextMaintenanceDate: nextDate,
          currentKm,
          remainingKm,
          remainingDays,
          status,
          car: carSummary,
        });

        evaluatedList.push(serializer);
      }
    }

    // Sort evaluated list
    const statusWeight: Record<string, number> = {
      OVERDUE: 1,
      DUE_SOON: 2,
      UPCOMING: 3,
      OK: 4,
    };

    const order =
      query.order && query.order.toString().toUpperCase() === 'DESC'
        ? 'DESC'
        : 'ASC';

    evaluatedList.sort((a, b) => {
      if (query.sortBy) {
        let valA: any = (a as any)[query.sortBy];
        let valB: any = (b as any)[query.sortBy];

        if (query.sortBy === 'car') {
          valA = a.car?.brand || '';
          valB = b.car?.brand || '';
        }

        if (valA === null || valA === undefined) valA = 9999999;
        if (valB === null || valB === undefined) valB = 9999999;

        if (valA < valB) return order === 'ASC' ? -1 : 1;
        if (valA > valB) return order === 'ASC' ? 1 : -1;
        return 0;
      }

      // Default sorting: Urgency first (OVERDUE -> DUE_SOON -> UPCOMING -> OK)
      const weightA = statusWeight[a.status] || 5;
      const weightB = statusWeight[b.status] || 5;

      if (weightA !== weightB) {
        return weightA - weightB;
      }

      // Secondary: smallest remainingKm
      const rKmA =
        a.remainingKm !== null && a.remainingKm !== undefined
          ? a.remainingKm
          : 9999999;
      const rKmB =
        b.remainingKm !== null && b.remainingKm !== undefined
          ? b.remainingKm
          : 9999999;

      if (rKmA !== rKmB) {
        return rKmA - rKmB;
      }

      // Tertiary: smallest remainingDays
      const rDaysA =
        a.remainingDays !== null && a.remainingDays !== undefined
          ? a.remainingDays
          : 9999999;
      const rDaysB =
        b.remainingDays !== null && b.remainingDays !== undefined
          ? b.remainingDays
          : 9999999;

      return rDaysA - rDaysB;
    });

    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 10;
    const totalItems = evaluatedList.length;

    const paged = evaluatedList.slice((page - 1) * limit, page * limit);
    const pageMetaDto = new PageMetaDto({
      itemCount: totalItems,
      pageOptionsDto: query,
    });

    return new PageDto(paged, pageMetaDto);
  }
}

function highestKm(records: { kmCounter: number }[] | undefined) {
  return records?.length
    ? Math.max(...records.map((r) => Number(r.kmCounter)))
    : undefined;
}
