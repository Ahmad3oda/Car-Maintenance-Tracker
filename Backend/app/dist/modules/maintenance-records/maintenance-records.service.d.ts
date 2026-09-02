import { MaintenanceRecordsRepository } from './maintenance-records.repository';
import { ItemsRepository } from '../items/items.repository';
import { CarsRepository } from '../cars/cars.repository';
import { CreateMaintenanceRecordDto } from './dtos/create-maintenance-record.dto';
import { UpdateMaintenanceRecordDto } from './dtos/update-maintenance-record.dto';
import { QueryMaintenanceRecordDto } from './dtos/query-maintenance-record.dto';
import { MaintenanceRecordSerializer } from './serializers/maintenance-record.serializer';
import { PageDto } from '../../common/dtos/page.dto';
export declare class MaintenanceRecordsService {
    private readonly recordsRepo;
    private readonly itemsRepo;
    private readonly carsRepo;
    constructor(recordsRepo: MaintenanceRecordsRepository, itemsRepo: ItemsRepository, carsRepo: CarsRepository);
    create(dto: CreateMaintenanceRecordDto, photo?: string): Promise<MaintenanceRecordSerializer>;
    findAll(query: QueryMaintenanceRecordDto): Promise<PageDto<MaintenanceRecordSerializer>>;
    findOne(id: number): Promise<MaintenanceRecordSerializer>;
    update(id: number, dto: UpdateMaintenanceRecordDto, photo?: string): Promise<MaintenanceRecordSerializer>;
    remove(id: number): Promise<void>;
    private updateItemMaintenanceStatus;
}
