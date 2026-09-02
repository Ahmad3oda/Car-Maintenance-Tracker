import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemsRepository } from './items.repository';
import { CarsRepository } from '../cars/cars.repository';
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

import { MaintenanceRecordsRepository } from '../maintenance-records/maintenance-records.repository';

@Injectable()
export class ItemsService {
  constructor(
    private readonly itemsRepo: ItemsRepository,
    private readonly carsRepo: CarsRepository,
    private readonly recordsRepo: MaintenanceRecordsRepository,
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

    let nextMaintenanceKm: number | null = null;
    if (dto.expectedMaintenanceKm) {
      nextMaintenanceKm = installedKm + Number(dto.expectedMaintenanceKm);
    }

    let nextMaintenanceDate: Date | null = null;
    if (dto.expectedMaintenanceMonths) {
      const d = new Date(installedDate);
      d.setMonth(d.getMonth() + Number(dto.expectedMaintenanceMonths));
      nextMaintenanceDate = d;
    }

    // 1. Create the item record
    const itemData = {
      ...dto,
      installedKm,
      installedDate,
      nextMaintenanceKm,
      nextMaintenanceDate,
      photoPath: photo ?? null,
    };
    const savedItem = await this.itemsRepo.create(itemData);

    // 2. Automatically create the first maintenance event (Initial Installation)
    const initialRecord = await this.recordsRepo.create({
      carId: dto.carId,
      itemId: savedItem.id,
      maintenanceDate: installedDate,
      kmCounter: installedKm,
      itemCost: 0,
      notes: 'Initial component installation',
    });

    // 3. Link item to the newly created initial maintenance event
    const updatedItem = await this.itemsRepo.update(savedItem.id, {
      lastMaintenanceId: initialRecord.id,
      lastMaintenanceDate: installedDate,
    });

    return plainToInstance(ItemSerializer, updatedItem || savedItem);
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

    const updateData: Partial<any> = { ...dto };
    if (photo) {
      if (item.photoPath) {
        await deleteUploadedFile('items', item.photoPath);
      }
      updateData.photoPath = photo;
    }

    // Recalculate nextMaintenanceKm and nextMaintenanceDate based on updated values
    const records = item.maintenanceRecords || [];
    const sortedRecords = [...records].sort(
      (a, b) =>
        new Date(b.maintenanceDate).getTime() -
        new Date(a.maintenanceDate).getTime(),
    );
    const latestRecord = sortedRecords[0];

    // Determine expectedMaintenanceKm
    const expectedKm =
      dto.expectedMaintenanceKm !== undefined
        ? dto.expectedMaintenanceKm
        : item.expectedMaintenanceKm;

    if (expectedKm === null || expectedKm === undefined || Number(expectedKm) <= 0) {
      updateData.expectedMaintenanceKm = null;
      updateData.nextMaintenanceKm = null;
    } else {
      updateData.expectedMaintenanceKm = Number(expectedKm);
      if (latestRecord) {
        updateData.nextMaintenanceKm =
          Number(latestRecord.kmCounter) + Number(expectedKm);
      } else {
        const installedKm =
          dto.installedKm !== undefined && dto.installedKm !== null
            ? dto.installedKm
            : item.installedKm;
        const baseKm =
          installedKm !== undefined && installedKm !== null
            ? Number(installedKm)
            : Number(targetCar?.currentKm || 0);
        updateData.nextMaintenanceKm = baseKm + Number(expectedKm);
      }
    }

    // Determine expectedMaintenanceMonths
    const expectedMonths =
      dto.expectedMaintenanceMonths !== undefined
        ? dto.expectedMaintenanceMonths
        : item.expectedMaintenanceMonths;

    if (expectedMonths === null || expectedMonths === undefined || Number(expectedMonths) <= 0) {
      updateData.expectedMaintenanceMonths = null;
      updateData.nextMaintenanceDate = null;
    } else {
      updateData.expectedMaintenanceMonths = Number(expectedMonths);
      if (latestRecord) {
        const d = new Date(latestRecord.maintenanceDate);
        d.setMonth(d.getMonth() + Number(expectedMonths));
        updateData.nextMaintenanceDate = d;
      } else {
        const installedDate =
          dto.installedDate !== undefined && dto.installedDate !== null
            ? dto.installedDate
            : item.installedDate;
        const d = installedDate ? new Date(installedDate) : new Date();
        d.setMonth(d.getMonth() + Number(expectedMonths));
        updateData.nextMaintenanceDate = d;
      }
    }

    const updatedItem = await this.itemsRepo.update(id, updateData);
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
