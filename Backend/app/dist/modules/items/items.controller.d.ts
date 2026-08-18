import { ItemsService } from './items.service';
import { CreateItemDto } from './dtos/create-item.dto';
import { UpdateItemDto } from './dtos/update-item.dto';
import { QueryItemDto } from './dtos/query-item.dto';
import { QueryUpcomingItemDto } from './dtos/query-upcoming-item.dto';
import { ItemSerializer } from './serializers/item.serializer';
import { UpcomingItemSerializer } from './serializers/upcoming-item.serializer';
import { PageDto } from '../../common/dtos/page.dto';
export declare class ItemsController {
    private readonly itemsService;
    constructor(itemsService: ItemsService);
    create(createItemDto: CreateItemDto, files?: {
        photoPath?: Express.Multer.File[];
        photo?: Express.Multer.File[];
    }): Promise<ItemSerializer>;
    findAll(query: QueryItemDto): Promise<PageDto<ItemSerializer>>;
    getUpcoming(query: QueryUpcomingItemDto): Promise<PageDto<UpcomingItemSerializer>>;
    findOne(id: number): Promise<ItemSerializer>;
    update(id: number, updateItemDto: UpdateItemDto, files?: {
        photoPath?: Express.Multer.File[];
        photo?: Express.Multer.File[];
    }): Promise<ItemSerializer>;
    remove(id: number): Promise<void>;
}
