import { MaintenanceRecordsService } from './maintenance-records.service';
import { CreateMaintenanceRecordDto } from './dtos/create-maintenance-record.dto';
import { UpdateMaintenanceRecordDto } from './dtos/update-maintenance-record.dto';
import { QueryMaintenanceRecordDto } from './dtos/query-maintenance-record.dto';
import { MaintenanceRecordSerializer } from './serializers/maintenance-record.serializer';
import { PageDto } from '../../common/dtos/page.dto';
export declare class MaintenanceRecordsController {
    private readonly recordsService;
    constructor(recordsService: MaintenanceRecordsService);
    create(createDto: CreateMaintenanceRecordDto): Promise<MaintenanceRecordSerializer>;
    findAll(query: QueryMaintenanceRecordDto): Promise<PageDto<MaintenanceRecordSerializer>>;
    findOne(id: number): Promise<MaintenanceRecordSerializer>;
    update(id: number, updateDto: UpdateMaintenanceRecordDto): Promise<MaintenanceRecordSerializer>;
    remove(id: number): Promise<void>;
}
