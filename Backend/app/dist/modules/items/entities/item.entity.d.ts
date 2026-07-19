import { Car } from '../../cars/entities/car.entity';
import { MaintenanceRecord } from '../../maintenance-records/entities/maintenance-record.entity';
export declare class Item {
    id: number;
    carId: number;
    car: Car;
    name: string;
    description: string;
    serialNumber: string;
    photoPath: string;
    installedDate: Date;
    installedKm: number;
    expectedMaintenanceKm: number;
    expectedMaintenanceMonths: number;
    lastMaintenanceId: number;
    nextMaintenanceKm: number;
    nextMaintenanceDate: Date;
    createdAt: Date;
    updatedAt: Date;
    maintenanceRecords: MaintenanceRecord[];
}
