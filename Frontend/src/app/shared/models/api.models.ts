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