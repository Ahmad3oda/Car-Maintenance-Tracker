import { Car } from '../../cars/entities/car.entity';
import { MaintenanceRecord } from '../../maintenance-records/entities/maintenance-record.entity';
export declare class Item {
    id: number;
    carId: number;
    car: Car;
    name: string;
    description: string;
    manufacturer: string;
    photoPath: string | null;
    installedDate: Date;
    installedKm: number;
    expectedMaintenanceKm: number;
    expectedMaintenanceMonths: number;
    lastMaintenanceId: number;
    lastMaintenanceDate: Date;
    nextMaintenanceKm: number;
    nextMaintenanceDate: Date;
    createdAt: Date;
    updatedAt: Date;
    maintenanceRecords: MaintenanceRecord[];
}
