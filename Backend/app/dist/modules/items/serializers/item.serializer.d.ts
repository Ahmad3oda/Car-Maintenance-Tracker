export declare class ItemSerializer {
    id: number;
    carId: number;
    name: string;
    description?: string;
    serialNumber?: string;
    photoPath?: string;
    installedDate?: Date;
    installedKm?: number;
    expectedMaintenanceKm?: number;
    expectedMaintenanceMonths?: number;
    lastMaintenanceId?: number;
    nextMaintenanceKm?: number;
    nextMaintenanceDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<ItemSerializer>);
}
