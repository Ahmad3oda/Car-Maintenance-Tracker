import { ItemsRepository } from './items.repository';
import { CarsRepository } from '../cars/cars.repository';
import { CreateItemDto } from './dtos/create-item.dto';
import { UpdateItemDto } from './dtos/update-item.dto';
import { QueryItemDto } from './dtos/query-item.dto';
import { QueryUpcomingItemDto } from './dtos/query-upcoming-item.dto';
import { ItemSerializer } from './serializers/item.serializer';
import { UpcomingItemSerializer } from './serializers/upcoming-item.serializer';
import { PageDto } from '../../common/dtos/page.dto';
import { MaintenanceRecordsRepository } from '../maintenance-records/maintenance-records.repository';
export declare class ItemsService {
    private readonly itemsRepo;
    private readonly carsRepo;
    private readonly recordsRepo;
    constructor(itemsRepo: ItemsRepository, carsRepo: CarsRepository, recordsRepo: MaintenanceRecordsRepository);
    create(dto: CreateItemDto, photo?: string): Promise<ItemSerializer>;
    findAll(query: QueryItemDto): Promise<PageDto<ItemSerializer>>;
    findOne(id: number): Promise<ItemSerializer>;
    update(id: number, dto: UpdateItemDto, photo?: string): Promise<ItemSerializer>;
    remove(id: number): Promise<void>;
    getUpcoming(query: QueryUpcomingItemDto): Promise<PageDto<UpcomingItemSerializer>>;
}
