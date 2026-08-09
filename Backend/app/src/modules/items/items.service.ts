import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemsRepository } from './items.repository';
import { CarsRepository } from '../cars/cars.repository';
import { CreateItemDto } from './dtos/create-item.dto';
import { UpdateItemDto } from './dtos/update-item.dto';
import { QueryItemDto } from './dtos/query-item.dto';
import { ItemSerializer } from './serializers/item.serializer';
import { PageDto } from '../../common/dtos/page.dto';
import { PageMetaDto } from '../../common/dtos/page-meta.dto';
import { plainToInstance } from 'class-transformer';
import { deleteUploadedFile } from '../../common/utils/multer.util';

@Injectable()
export class ItemsService {
  constructor(
    private readonly itemsRepo: ItemsRepository,
    private readonly carsRepo: CarsRepository,
  ) {}

  async create(dto: CreateItemDto, photo?: string): Promise<ItemSerializer> {
    const car = await this.carsRepo.findOne(dto.carId);
    if (!car) {
      if (photo) {
        await deleteUploadedFile('items', photo);
      }
      throw new NotFoundException(`Car with ID ${dto.carId} not found`);
    }

    const itemData = {
      ...dto,
      photoPath: photo ?? null,
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

    if (dto.carId && dto.carId !== item.carId) {
      const car = await this.carsRepo.findOne(dto.carId);
      if (!car) {
        if (photo) {
          await deleteUploadedFile('items', photo);
        }
        throw new NotFoundException(`Car with ID ${dto.carId} not found`);
      }
    }

    const updateData: Partial<any> = { ...dto };
    if (photo) {
      if (item.photoPath) {
        await deleteUploadedFile('items', item.photoPath);
      }
      updateData.photoPath = photo;
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
}
