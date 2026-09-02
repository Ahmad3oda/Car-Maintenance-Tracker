import { Car } from '../../cars/entities/car.entity';
import { Item } from '../../items/entities/item.entity';
export declare class MaintenanceRecord {
    id: number;
    carId: number;
    car: Car;
    itemId: number;
    item: Item;
    maintenanceDate: Date;
    kmCounter: number;
    itemCost: number;
    extraCosts: any;
    notes: string;
    photoPath: string | null;
    createdAt: Date;
    updatedAt: Date;
}
