import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { ItemsRepository } from './items.repository';
import { CreateItemDto } from './dtos/create-item.dto';
import { UpdateItemDto } from './dtos/update-item.dto';
import { QueryItemDto } from './dtos/query-item.dto';
import { ItemSerializer } from './serializers/item.serializer';
import { PageDto } from '../../common/dtos/page.dto';
import { PageMetaDto } from '../../common/dtos/page-meta.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ItemsService {
  constructor(private readonly itemsRepo: ItemsRepository) {}

  async create(dto: CreateItemDto, photo?: string): Promise<ItemSerializer> {
    const itemData = {
      ...dto,
      photoPath: photo ? photo : undefined,
    };
    const savedItem = await this.itemsRepo.create(itemData);
    return plainToInstance(ItemSerializer, savedItem);
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
    const serializedItems = items.map((item) => plainToInstance(ItemSerializer, item));

    return new PageDto(serializedItems, pageMetaDto);
  }

  async findOne(id: number): Promise<ItemSerializer> {
    const item = await this.itemsRepo.findOne(id);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return plainToInstance(ItemSerializer, item);
  }

  async update(id: number, dto: UpdateItemDto, photo?: string): Promise<ItemSerializer> {
    const item = await this.itemsRepo.findOne(id);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    if (photo && item.photoPath) {
      const oldPath = join(process.cwd(), 'uploads', item.photoPath);
      if (existsSync(oldPath)) unlinkSync(oldPath);
    }

    const updateData = { ...dto };
    if (photo) updateData['photoPath'] = photo;

    const updatedItem = await this.itemsRepo.update(id, updateData);
    return plainToInstance(ItemSerializer, updatedItem);
  }

  async remove(id: number): Promise<void> {
    const item = await this.itemsRepo.findOne(id);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    if (item.photoPath) {
      const p = join(process.cwd(), 'uploads', item.photoPath);
      if (existsSync(p)) unlinkSync(p);
    }

    await this.itemsRepo.remove(id);
  }
}
