import { ExtraCostDto } from '../dtos/create-maintenance-record.dto';
export declare class MaintenanceRecordSerializer {
    id: number;
    carId: number;
    itemId: number;
    maintenanceDate: Date;
    kmCounter: number;
    itemCost: number;
    extraCosts?: ExtraCostDto[];
    notes?: string;
    photoPath?: string | null;
    car?: any;
    item?: any;
    createdAt: Date;
    updatedAt: Date;
    get totalCost(): number;
    constructor(partial: Partial<MaintenanceRecordSerializer>);
}
