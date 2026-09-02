export declare class CreateItemDto {
    carId: number;
    name: string;
    description?: string;
    manufacturer?: string;
    photoPath?: any;
    installedDate: Date;
    installedKm?: number | null;
    expectedMaintenanceKm?: number | null;
    expectedMaintenanceMonths?: number | null;
}
