import { Injectable, NotFoundException } from '@nestjs/common';
import { MaintenanceRecordsRepository } from './maintenance-records.repository';
import { ItemsRepository } from '../items/items.repository';
import { CreateMaintenanceRecordDto } from './dtos/create-maintenance-record.dto';
import { UpdateMaintenanceRecordDto } from './dtos/update-maintenance-record.dto';
import { QueryMaintenanceRecordDto } from './dtos/query-maintenance-record.dto';
import { MaintenanceRecordSerializer } from './serializers/maintenance-record.serializer';
import { PageDto } from '../../common/dtos/page.dto';
import { PageMetaDto } from '../../common/dtos/page-meta.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MaintenanceRecordsService {
  constructor(
    private readonly recordsRepo: MaintenanceRecordsRepository,
    private readonly itemsRepo: ItemsRepository,
  ) {}

  async create(dto: CreateMaintenanceRecordDto): Promise<MaintenanceRecordSerializer> {
    const item = await this.itemsRepo.findOne(dto.itemId);
    if (!item) {
      throw new NotFoundException(`Item with ID ${dto.itemId} not found`);
    }

    const record = await this.recordsRepo.create(dto);

    // Update Item's lastMaintenanceId and next maintenance calculations
    item.lastMaintenanceId = record.id;
    
    if (item.expectedMaintenanceKm) {
      item.nextMaintenanceKm = dto.kmCounter + item.expectedMaintenanceKm;
    }

    if (item.expectedMaintenanceMonths) {
      const nextDate = new Date(dto.maintenanceDate);
      nextDate.setMonth(nextDate.getMonth() + item.expectedMaintenanceMonths);
      item.nextMaintenanceDate = nextDate;
    }

    await this.itemsRepo.save(item);

    return plainToInstance(MaintenanceRecordSerializer, record);
  }

  async findAll(query: QueryMaintenanceRecordDto): Promise<PageDto<MaintenanceRecordSerializer>> {
    const [records, itemCount] = await this.recordsRepo.findAll(
      query.page,
      query.limit,
      query.search,
      query.sortBy,
      query.order,
      query.carId,
      query.itemId,
    );

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: query });
    const serializedRecords = records.map((r) => plainToInstance(MaintenanceRecordSerializer, r));

    return new PageDto(serializedRecords, pageMetaDto);
  }

  async findOne(id: number): Promise<MaintenanceRecordSerializer> {
    const record = await this.recordsRepo.findOne(id);
    if (!record) {
      throw new NotFoundException(`MaintenanceRecord with ID ${id} not found`);
    }
    return plainToInstance(MaintenanceRecordSerializer, record);
  }

  async update(id: number, dto: UpdateMaintenanceRecordDto): Promise<MaintenanceRecordSerializer> {
    const record = await this.recordsRepo.findOne(id);
    if (!record) {
      throw new NotFoundException(`MaintenanceRecord with ID ${id} not found`);
    }
    const updatedRecord = await this.recordsRepo.update(id, dto);
    
    // We optionally recalculate Item's next maintenance if dates/kms were changed
    // For simplicity, we just update the record here. Full recalculation could be complex
    // if this is the "latest" record.

    return plainToInstance(MaintenanceRecordSerializer, updatedRecord);
  }

  async remove(id: number): Promise<void> {
    const record = await this.recordsRepo.findOne(id);
    if (!record) {
      throw new NotFoundException(`MaintenanceRecord with ID ${id} not found`);
    }
    await this.recordsRepo.remove(id);
  }
}
