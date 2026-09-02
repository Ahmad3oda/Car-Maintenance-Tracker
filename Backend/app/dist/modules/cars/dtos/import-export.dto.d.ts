export declare class ImportExtraCostDto {
    name: string;
    cost: number;
}
export declare class ImportMaintenanceRecordDto {
    maintenanceDate: string;
    kmCounter: number;
    itemCost: number;
    extraCosts?: ImportExtraCostDto[];
    notes?: string;
}
export declare class ImportItemDto {
    name: string;
    description?: string;
    manufacturer?: string;
    installedDate?: string;
    installedKm?: number;
    expectedMaintenanceKm?: number;
    expectedMaintenanceMonths?: number;
    events?: ImportMaintenanceRecordDto[];
}
export declare class ImportCarDataDto {
    version?: string;
    items: ImportItemDto[];
}
export declare class ExportCarSummaryDto {
    plateNumber: string;
    brand: string;
    model: string;
    year: number;
    currentKm: number;
}
export declare class ExportCarDataDto {
    version: string;
    exportedAt: string;
    car: ExportCarSummaryDto;
    items: Array<{
        name: string;
        description?: string | null;
        manufacturer?: string | null;
        installedDate?: Date | string | null;
        installedKm?: number | null;
        expectedMaintenanceKm?: number | null;
        expectedMaintenanceMonths?: number | null;
        events: Array<{
            maintenanceDate: Date | string;
            kmCounter: number;
            itemCost: number;
            extraCosts?: any;
            notes?: string | null;
        }>;
    }>;
}
export declare class ImportResultDto {
    success: boolean;
    importedItems: number;
    importedEvents: number;
    message: string;
}
