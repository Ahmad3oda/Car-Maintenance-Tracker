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
}

// --- Backend-aligned DTOs ---

export interface CarDto {
  id: number;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  currentKm: number;
  photoPath?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCarDto {
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  currentKm?: number;
  photoPath?: string;
}

export interface ItemDto {
  id: number;
  carId: number;
  name: string;
  description?: string;
  serialNumber?: string;
  photoPath?: string;
  installedDate?: string;
  installedKm?: number;
  expectedMaintenanceKm?: number;
  expectedMaintenanceMonths?: number;
  nextMaintenanceKm?: number;
  nextMaintenanceDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRecordDto {
  id: number;
  carId: number;
  itemId: number;
  maintenanceDate: string;
  kmCounter: number;
  itemCost: number;
  extraCosts?: { name: string; cost: number }[];
  notes?: string;
  totalCost: number; // computed by backend serializer
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaintenanceRecordDto {
  carId: number;
  itemId: number;
  maintenanceDate: string;  // ISO date
  kmCounter: number;
  itemCost: number;
  extraCosts?: { name: string; cost: number }[];
  notes?: string;
}

export interface DashboardStats {
  totalCars: number;
  totalItems: number;
  maintenanceThisMonth: number;
  upcomingMaintenance: number;
}