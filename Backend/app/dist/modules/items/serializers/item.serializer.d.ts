export declare class ItemSerializer {
    id: number;
    carId: number;
    name: string;
    description?: string;
    manufacturer?: string;
    photoPath?: string | null;
    installedDate?: Date;
    installedKm?: number;
    expectedMaintenanceKm?: number;
    expectedMaintenanceMonths?: number;
    maintenanceRecords?: any[];
    lastMaintenanceId?: number;
    lastMaintenanceDate?: Date;
    get lastInstallment(): Date | null;
    nextMaintenanceKm?: number;
    nextMaintenanceDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<ItemSerializer>);
}
