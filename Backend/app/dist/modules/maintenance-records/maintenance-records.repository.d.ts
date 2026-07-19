import { Repository } from 'typeorm';
import { MaintenanceRecord } from './entities/maintenance-record.entity';
export declare class MaintenanceRecordsRepository {
    private readonly repo;
    constructor(repo: Repository<MaintenanceRecord>);
    create(record: Partial<MaintenanceRecord>): Promise<MaintenanceRecord>;
    findAll(page?: number, limit?: number, search?: string, sortBy?: string, order?: 'ASC' | 'DESC', carId?: number, itemId?: number): Promise<[MaintenanceRecord[], number]>;
    findOne(id: number): Promise<MaintenanceRecord | null>;
    update(id: number, record: Partial<MaintenanceRecord>): Promise<MaintenanceRecord | null>;
    remove(id: number): Promise<void>;
}
