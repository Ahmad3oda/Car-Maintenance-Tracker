import { Item } from '../../items/entities/item.entity';
import { MaintenanceRecord } from '../../maintenance-records/entities/maintenance-record.entity';
export declare class Car {
    id: number;
    plateNumber: string;
    brand: string;
    model: string;
    year: number;
    currentKm: number;
    photoPath: string | null;
    createdAt: Date;
    updatedAt: Date;
    items: Item[];
    maintenanceRecords: MaintenanceRecord[];
}
