import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MaintenanceRecordsRepository } from './maintenance-records.repository';
import { MaintenanceRecord } from './entities/maintenance-record.entity';
import { ItemsRepository } from '../items/items.repository';
import { OdometerService } from '../cars/odometer.service';
import { CreateMaintenanceRecordDto } from './dtos/create-maintenance-record.dto';
import { UpdateMaintenanceRecordDto } from './dtos/update-maintenance-record.dto';
import { QueryMaintenanceRecordDto } from './dtos/query-maintenance-record.dto';
import { MaintenanceRecordSerializer } from './serializers/maintenance-record.serializer';
import { PageDto } from '../../common/dtos/page.dto';
import { PageMetaDto } from '../../common/dtos/page-meta.dto';
import { plainToInstance } from 'class-transformer';
import { deleteUploadedFile } from '../../common/utils/multer.util';
import { computeMaintenanceSchedule } from '../items/maintenance-schedule.util';

@Injectable()
export class MaintenanceRecordsService {
  constructor(
    private readonly recordsRepo: MaintenanceRecordsRepository,
    private readonly itemsRepo: ItemsRepository,
    private readonly odometer: OdometerService,
  ) {}

  async create(
    userId: number,
    dto: CreateMaintenanceRecordDto,
    photo?: string,
  ): Promise<MaintenanceRecordSerializer> {
    const item = await this.itemsRepo.findOne(dto.itemId, userId);
    if (!item) {
      if (photo) {
        await deleteUploadedFile('maintenance-records', photo);
      }
      throw new NotFoundException(`Item with ID ${dto.itemId} not found`);
    }

    if (dto.carId && dto.carId !== item.carId) {
      if (photo) {
        await deleteUploadedFile('maintenance-records', photo);
      }
      throw this.carMismatch(item.id, item.carId, dto.carId);
    }

    const recordData = {
      ...dto,
      carId: item.carId,
      photoPath: photo ?? null,
    };

    const record = await this.recordsRepo.create(recordData);

    // Recalculate item maintenance status
    await this.updateItemMaintenanceStatus(item.id, userId);
    await this.odometer.sync(item.carId);

    return plainToInstance(MaintenanceRecordSerializer, record);
  }

  async findAll(
    userId: number,
    query: QueryMaintenanceRecordDto,
  ): Promise<PageDto<MaintenanceRecordSerializer>> {
    const [records, itemCount] = await this.recordsRepo.findAll(
      userId,
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

  async findOne(
    userId: number,
    id: number,
  ): Promise<MaintenanceRecordSerializer> {
    const record = await this.recordsRepo.findOne(id, userId);
    if (!record) {
      throw new NotFoundException(`MaintenanceRecord with ID ${id} not found`);
    }
    return plainToInstance(MaintenanceRecordSerializer, record);
  }

  async update(
    userId: number,
    id: number,
    dto: UpdateMaintenanceRecordDto,
    photo?: string,
  ): Promise<MaintenanceRecordSerializer> {
    const record = await this.recordsRepo.findOne(id, userId);
    if (!record) {
      if (photo) {
        await deleteUploadedFile('maintenance-records', photo);
      }
      throw new NotFoundException(`MaintenanceRecord with ID ${id} not found`);
    }

    let item = record.item;
    if (dto.itemId && dto.itemId !== record.itemId) {
      const newItem = await this.itemsRepo.findOne(dto.itemId, userId);
      if (!newItem) {
        if (photo) {
          await deleteUploadedFile('maintenance-records', photo);
        }
        throw new NotFoundException(`Item with ID ${dto.itemId} not found`);
      }
      item = newItem;
    }

    if (dto.carId && dto.carId !== item.carId) {
      if (photo) {
        await deleteUploadedFile('maintenance-records', photo);
      }
      throw this.carMismatch(item.id, item.carId, dto.carId);
    }

    const updateData: Partial<MaintenanceRecord> = {
      ...dto,
      carId: item.carId,
    };
    // photoPath is set only from an uploaded file, never from the body.
    delete updateData.photoPath;
    if (photo) {
      if (record.photoPath) {
        await deleteUploadedFile('maintenance-records', record.photoPath);
      }
      updateData.photoPath = photo;
    }

    await this.recordsRepo.update(id, updateData);
    const updatedRecord = await this.recordsRepo.findOne(id, userId);

    // Recalculate item maintenance status
    await this.updateItemMaintenanceStatus(record.itemId, userId);
    if (dto.itemId && dto.itemId !== record.itemId) {
      await this.updateItemMaintenanceStatus(dto.itemId, userId);
    }
    await this.odometer.sync(item.carId, record.kmCounter);
    if (record.carId !== item.carId) {
      await this.odometer.sync(record.carId, record.kmCounter);
    }

    return plainToInstance(MaintenanceRecordSerializer, updatedRecord);
  }

  async remove(userId: number, id: number): Promise<void> {
    const record = await this.recordsRepo.findOne(id, userId);
    if (!record) {
      throw new NotFoundException(`MaintenanceRecord with ID ${id} not found`);
    }

    const itemId = record.itemId;

    if (record.photoPath) {
      await deleteUploadedFile('maintenance-records', record.photoPath);
    }

    await this.recordsRepo.remove(id);

    // Recalculate item maintenance status after record removal
    await this.updateItemMaintenanceStatus(itemId, userId);
    await this.odometer.sync(record.carId, record.kmCounter);
  }

  /** A record's car is always its item's car. */
  private carMismatch(itemId: number, itemCarId: number, carId: number) {
    return new BadRequestException(
      `Item ${itemId} belongs to car ${itemCarId}, not car ${carId}`,
    );
  }

  private async updateItemMaintenanceStatus(
    itemId: number,
    userId: number,
  ): Promise<void> {
    const item = await this.itemsRepo.findOne(itemId, userId);
    if (!item) return;

    await this.itemsRepo.update(
      item.id,
      computeMaintenanceSchedule(item, item.maintenanceRecords),
    );
  }
}
