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
    createdAt: Date;
    updatedAt: Date;
    get totalCost(): number;
    constructor(partial: Partial<MaintenanceRecordSerializer>);
}
