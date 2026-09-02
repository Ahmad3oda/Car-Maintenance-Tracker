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
    installedDate: Date | null;
    installedKm: number | null;
    expectedMaintenanceKm: number | null;
    expectedMaintenanceMonths: number | null;
    lastMaintenanceId: number | null;
    lastMaintenanceDate: Date | null;
    nextMaintenanceKm: number | null;
    nextMaintenanceDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
    maintenanceRecords: MaintenanceRecord[];
}
