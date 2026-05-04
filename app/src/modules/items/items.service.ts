import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { Item } from './entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { QueryItemDto } from './dto/query-item.dto';
import { Record } from '../records/entities/record.entity';
import { ItemSerializer } from './serializers/item.serializer';
import { SingleItemSerializer } from './serializers/single-item.serializer';
import { MessageSerializer } from 'src/serializers/message.serializer';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private readonly itemRepo: Repository<Item>,
    @InjectRepository(Record) private readonly recordRepo: Repository<Record>,
  ) {}

  async create(dto: CreateItemDto, photo?: string): Promise<ItemSerializer> {
    const item = this.itemRepo.create({
      ...dto,
      photoPath: photo ? photo : undefined,
    });
    const savedItem = await this.itemRepo.save(item);
    return {
      ...savedItem,
      lastRecord: null,
    };
  }

  async findAll(query: QueryItemDto) {
    const {
      search,
      page = 1,
      limit = 20,
      sortBy = 'lastRecordDate',
      order = 'DESC',
    } = query;

    // ─── STEP 1: Paginate items WITHOUT joining records ───
    const queryBuilder = this.itemRepo.createQueryBuilder('item');

    if (search) {
      queryBuilder.where('item.name LIKE :s OR item.description LIKE :s', {
        s: `%${search}%`,
      });
    }

    // Special case: sort by last record date — use a correlated subquery
    if (sortBy === 'lastRecordDate') {
      queryBuilder
        .addSelect(
          (sub) =>
            sub
              .select('MAX(r.date)')
              .from(Record, 'r')
              .where('r.itemId = item.id'),
          'last_date',
        )
        .orderBy('last_date', order, 'NULLS LAST');
    } else {
      queryBuilder.orderBy(`item.${sortBy}`, order);
    }

    // Pagination is now SAFE — we're paginating unique items, no duplication
    const [items, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    if (items.length === 0) {
      return { data: [], total, page, limit };
    }

    // ─── STEP 2: Fetch ONLY the last record for each item in ONE query ───
    const itemIds = items.map((i) => i.id);

    const lastRecords = await this.recordRepo
      .createQueryBuilder('r')
      .where('r.itemId IN (:...itemIds)', { itemIds })
      .andWhere((qb2) => {
        const sub = qb2
          .subQuery()
          .select('MAX(r2.date)')
          .from(Record, 'r2')
          .where('r2.itemId = r.itemId')
          .getQuery();
        return `r.date = ${sub}`;
      })
      .getMany();

    // ─── STEP 3: Stitch them together ───
    const itemIdRecordMap = new Map(lastRecords.map((r) => [r.itemId, r]));

    const data = items.map((item) => ({
      ...item,
      lastRecord: itemIdRecordMap.get(item.id) ?? null,
    })) as ItemSerializer[];

    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<SingleItemSerializer> {
    const item = await this.itemRepo.findOne({
      where: { id },
    });
    if (!item) throw new NotFoundException(`Item ${id} not found`);

    return { ...item };
  }

  async update(
    id: number,
    dto: UpdateItemDto,
    photo?: string,
  ): Promise<SingleItemSerializer> {
    const item = await this.itemRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`Item ${id} not found`);

    if (photo && item.photoPath) {
      const oldPath = join(process.cwd(), 'uploads', item.photoPath);
      if (existsSync(oldPath)) unlinkSync(oldPath);
    }

    Object.assign(item, dto);
    if (photo) item.photoPath = photo;
    return this.itemRepo.save(item);
  }

  async remove(id: number): Promise<MessageSerializer> {
    const item = await this.itemRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`Item ${id} not found`);

    if (item.photoPath) {
      const p = join(process.cwd(), 'uploads', item.photoPath);
      if (existsSync(p)) unlinkSync(p);
    }

    await this.itemRepo.remove(item);
    return { message: 'Deleted - id:' + id };
  }
}
