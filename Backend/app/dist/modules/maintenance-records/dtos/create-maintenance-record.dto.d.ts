export declare class ExtraCostDto {
    name: string;
    cost: number;
}
export declare class CreateMaintenanceRecordDto {
    carId: number;
    itemId: number;
    maintenanceDate: Date;
    kmCounter: number;
    itemCost: number;
    extraCosts?: ExtraCostDto[];
    notes?: string;
}
