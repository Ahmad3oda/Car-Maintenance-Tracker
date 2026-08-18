export declare class UpcomingCarSummarySerializer {
    id: number;
    brand: string;
    model: string;
    plateNumber: string;
    currentKm: number;
}
export declare class UpcomingItemSerializer {
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
    lastMaintenanceDate?: Date;
    nextMaintenanceKm?: number | null;
    nextMaintenanceDate?: Date | null;
    currentKm?: number;
    remainingKm?: number | null;
    remainingDays?: number | null;
    status: 'OVERDUE' | 'DUE_SOON' | 'UPCOMING' | 'OK';
    car?: UpcomingCarSummarySerializer;
    constructor(partial: Partial<UpcomingItemSerializer>);
}
