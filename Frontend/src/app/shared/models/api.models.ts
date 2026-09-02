export interface PageMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Page<T> {
  data: T[];
  meta: PageMeta;
}

export interface PageQuery {
  page?: number;
  limit?: number;
  order?: 'ASC' | 'DESC';
  search?: string;
  sortBy?: string;
  carId?: number;
  itemId?: number;
  startDate?: string;
  endDate?: string;
}

// --- Car Models ---

export interface CarDto {
  id: number;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  currentKm: number;
  photoPath?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCarDto {
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  currentKm?: number;
  photoPath?: string | File | null;
}

// --- Item Models ---

export interface ItemDto {
  id: number;
  carId: number;
  name: string;
  description?: string;
  manufacturer?: string;
  photoPath?: string | null;
  installedDate?: string;
  installedKm?: number;
  expectedMaintenanceKm?: number;
  expectedMaintenanceMonths?: number;
  car?: CarDto | null;
  lastMaintenanceId?: number | null;
  lastMaintenanceDate?: string | null;
  lastInstallment?: string | null;
  nextMaintenanceKm?: number | null;
  nextMaintenanceDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemDto {
  carId: number;
  name: string;
  description?: string;
  manufacturer?: string;
  installedDate?: string;
  installedKm?: number;
  expectedMaintenanceKm?: number;
  expectedMaintenanceMonths?: number;
  photoPath?: string | File | null;
}

// --- Maintenance Record / Event Models ---

export interface ExtraCost {
  name: string;
  cost: number;
}

export interface MaintenanceRecordDto {
  id: number;
  carId: number;
  itemId: number;
  maintenanceDate: string;
  kmCounter: number;
  itemCost: number;
  extraCosts?: ExtraCost[];
  notes?: string;
  photoPath?: string | null;
  totalCost: number;
  car?: {
    id: number;
    plateNumber: string;
    brand: string;
    model: string;
  };
  item?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaintenanceRecordDto {
  carId?: number;
  itemId: number;
  maintenanceDate: string;
  kmCounter: number;
  itemCost: number;
  extraCosts?: ExtraCost[];
  notes?: string;
  photoPath?: string | File | null;
}

// --- Dashboard Stats ---

export interface DashboardStats {
  totalCars: number;
  totalItems: number;
  itemsReplacedLastMonth: number;
  itemsReplacedLastYear: number;
  costSpentLastMonth: number;
  costSpentLastYear: number;
}

// --- Upcoming & Due Maintenance Models ---

export type MaintenanceUrgencyStatus = 'OVERDUE' | 'DUE_SOON' | 'UPCOMING' | 'OK';

export interface UpcomingCarSummary {
  id: number;
  brand: string;
  model: string;
  plateNumber: string;
  currentKm: number;
}

export interface UpcomingItemDto {
  id: number;
  carId: number;
  name: string;
  description?: string;
  manufacturer?: string;
  photoPath?: string | null;
  installedDate?: string;
  installedKm?: number;
  expectedMaintenanceKm?: number;
  expectedMaintenanceMonths?: number;
  lastMaintenanceDate?: string;
  nextMaintenanceKm?: number | null;
  nextMaintenanceDate?: string | null;
  currentKm?: number;
  remainingKm?: number | null;
  remainingDays?: number | null;
  status: MaintenanceUrgencyStatus;
  car?: UpcomingCarSummary;
}

export type UpcomingScope = 'due_soon_or_overdue' | 'overdue_only' | 'within_1k_km' | 'within_30_days' | 'all';

export interface UpcomingQueryDto extends PageQuery, Record<string, unknown> {
  scope?: UpcomingScope;
}

// --- Import & Export Models ---

export interface ImportExtraCostDto {
  name: string;
  cost: number;
}

export interface ImportMaintenanceRecordDto {
  maintenanceDate: string;
  kmCounter: number;
  itemCost: number;
  extraCosts?: ImportExtraCostDto[];
  notes?: string;
}

export interface ImportItemDto {
  name: string;
  description?: string;
  manufacturer?: string;
  installedDate?: string;
  installedKm?: number;
  expectedMaintenanceKm?: number;
  expectedMaintenanceMonths?: number;
  events?: ImportMaintenanceRecordDto[];
}

export interface ImportCarDataDto {
  version?: string;
  items: ImportItemDto[];
}

export interface ExportCarSummaryDto {
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  currentKm: number;
}

export interface ExportCarDataDto {
  version: string;
  exportedAt: string;
  car: ExportCarSummaryDto;
  items: Array<{
    name: string;
    description?: string | null;
    manufacturer?: string | null;
    installedDate?: string | null;
    installedKm?: number | null;
    expectedMaintenanceKm?: number | null;
    expectedMaintenanceMonths?: number | null;
    events: Array<{
      maintenanceDate: string;
      kmCounter: number;
      itemCost: number;
      extraCosts?: ImportExtraCostDto[] | null;
      notes?: string | null;
    }>;
  }>;
}

export interface ImportResultDto {
  success: boolean;
  importedItems: number;
  importedEvents: number;
  message: string;
}