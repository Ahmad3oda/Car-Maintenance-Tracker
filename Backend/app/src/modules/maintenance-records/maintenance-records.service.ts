import { Injectable, NotFoundException } from '@nestjs/common';
import { MaintenanceRecordsRepository } from './maintenance-records.repository';
import { ItemsRepository } from '../items/items.repository';
import { CarsRepository } from '../cars/cars.repository';
import { CreateMaintenanceRecordDto } from './dtos/create-maintenance-record.dto';
import { UpdateMaintenanceRecordDto } from './dtos/update-maintenance-record.dto';
import { QueryMaintenanceRecordDto } from './dtos/query-maintenance-record.dto';
import { MaintenanceRecordSerializer } from './serializers/maintenance-record.serializer';
import { PageDto } from '../../common/dtos/page.dto';
import { PageMetaDto } from '../../common/dtos/page-meta.dto';
import { plainToInstance } from 'class-transformer';
import { deleteUploadedFile } from '../../common/utils/multer.util';

@Injectable()
export class MaintenanceRecordsService {
  constructor(
    private readonly recordsRepo: MaintenanceRecordsRepository,
    private readonly itemsRepo: ItemsRepository,
    private readonly carsRepo: CarsRepository,
  ) {}

  async create(
    dto: CreateMaintenanceRecordDto,
    photo?: string,
  ): Promise<MaintenanceRecordSerializer> {
    const item = await this.itemsRepo.findOne(dto.itemId);
    if (!item) {
      if (photo) {
        await deleteUploadedFile('maintenance-records', photo);
      }
      throw new NotFoundException(`Item with ID ${dto.itemId} not found`);
    }

    const carId = dto.carId || item.carId;
    const car = await this.carsRepo.findOne(carId);
    if (!car) {
      if (photo) {
        await deleteUploadedFile('maintenance-records', photo);
      }
      throw new NotFoundException(`Car with ID ${carId} not found`);
    }

    const recordData = {
      ...dto,
      carId,
      photoPath: photo ?? null,
    };

    const record = await this.recordsRepo.create(recordData);

    // Recalculate item maintenance status
    await this.updateItemMaintenanceStatus(item.id);

    return plainToInstance(MaintenanceRecordSerializer, record);
  }

  async findAll(
    query: QueryMaintenanceRecordDto,
  ): Promise<PageDto<MaintenanceRecordSerializer>> {
    const [records, itemCount] = await this.recordsRepo.findAll(
      query.page,
      query.limit,
      query.search,
      query.sortBy,
      query.order,
      query.carId,
      query.itemId,
      query.startDate,
      query.endDate,
    );

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: query });
    const serializedRecords = records.map((r) =>
      plainToInstance(MaintenanceRecordSerializer, r),
    );

    return new PageDto(serializedRecords, pageMetaDto);
  }

  async findOne(id: number): Promise<MaintenanceRecordSerializer> {
    const record = await this.recordsRepo.findOne(id);
    if (!record) {
      throw new NotFoundException(`MaintenanceRecord with ID ${id} not found`);
    }
    return plainToInstance(MaintenanceRecordSerializer, record);
  }

  async update(
    id: number,
    dto: UpdateMaintenanceRecordDto,
    photo?: string,
  ): Promise<MaintenanceRecordSerializer> {
    const record = await this.recordsRepo.findOne(id);
    if (!record) {
      if (photo) {
        await deleteUploadedFile('maintenance-records', photo);
      }
      throw new NotFoundException(`MaintenanceRecord with ID ${id} not found`);
    }

    if (dto.itemId && dto.itemId !== record.itemId) {
      const item = await this.itemsRepo.findOne(dto.itemId);
      if (!item) {
        if (photo) {
          await deleteUploadedFile('maintenance-records', photo);
        }
        throw new NotFoundException(`Item with ID ${dto.itemId} not found`);
      }
    }

    if (dto.carId && dto.carId !== record.carId) {
      const car = await this.carsRepo.findOne(dto.carId);
      if (!car) {
        if (photo) {
          await deleteUploadedFile('maintenance-records', photo);
        }
        throw new NotFoundException(`Car with ID ${dto.carId} not found`);
      }
    }

    const updateData: Partial<any> = { ...dto };
    if (photo) {
      if (record.photoPath) {
        await deleteUploadedFile('maintenance-records', record.photoPath);
      }
      updateData.photoPath = photo;
    }

    const updatedRecord = await this.recordsRepo.update(id, updateData);

    // Recalculate item maintenance status
    await this.updateItemMaintenanceStatus(record.itemId);
    if (dto.itemId && dto.itemId !== record.itemId) {
      await this.updateItemMaintenanceStatus(dto.itemId);
    }

    return plainToInstance(MaintenanceRecordSerializer, updatedRecord);
  }

  async remove(id: number): Promise<void> {
    const record = await this.recordsRepo.findOne(id);
    if (!record) {
      throw new NotFoundException(`MaintenanceRecord with ID ${id} not found`);
    }

    const itemId = record.itemId;

    if (record.photoPath) {
      await deleteUploadedFile('maintenance-records', record.photoPath);
    }

    await this.recordsRepo.remove(id);

    // Recalculate item maintenance status after record removal
    await this.updateItemMaintenanceStatus(itemId);
  }

  private async updateItemMaintenanceStatus(itemId: number): Promise<void> {
    const item = await this.itemsRepo.findOne(itemId);
    if (!item) return;

    // Find all maintenance records for this item sorted by date descending
    const [records] = await this.recordsRepo.findAll(
      1,
      1000,
      undefined,
      'maintenanceDate',
      'DESC',
      undefined,
      itemId,
    );

    const latestRecord = records[0];
    const updateData: Partial<any> = {};

    if (latestRecord) {
      updateData.lastMaintenanceId = latestRecord.id;
      updateData.lastMaintenanceDate = latestRecord.maintenanceDate;

      if (item.expectedMaintenanceKm && Number(item.expectedMaintenanceKm) > 0) {
        updateData.nextMaintenanceKm =
          Number(latestRecord.kmCounter) + Number(item.expectedMaintenanceKm);
      } else {
        updateData.nextMaintenanceKm = null;
      }

      if (item.expectedMaintenanceMonths && Number(item.expectedMaintenanceMonths) > 0) {
        const nextDate = new Date(latestRecord.maintenanceDate);
        nextDate.setMonth(
          nextDate.getMonth() + Number(item.expectedMaintenanceMonths),
        );
        updateData.nextMaintenanceDate = nextDate;
      } else {
        updateData.nextMaintenanceDate = null;
      }
    } else {
      updateData.lastMaintenanceId = null;
      updateData.lastMaintenanceDate = null;

      if (
        item.installedKm !== null &&
        item.installedKm !== undefined &&
        item.expectedMaintenanceKm &&
        Number(item.expectedMaintenanceKm) > 0
      ) {
        updateData.nextMaintenanceKm =
          Number(item.installedKm) + Number(item.expectedMaintenanceKm);
      } else {
        updateData.nextMaintenanceKm = null;
      }

      if (
        item.installedDate &&
        item.expectedMaintenanceMonths &&
        Number(item.expectedMaintenanceMonths) > 0
      ) {
        const nextDate = new Date(item.installedDate);
        nextDate.setMonth(
          nextDate.getMonth() + Number(item.expectedMaintenanceMonths),
        );
        updateData.nextMaintenanceDate = nextDate;
      } else {
        updateData.nextMaintenanceDate = null;
      }
    }

    await this.itemsRepo.update(item.id, updateData);
  }
}
