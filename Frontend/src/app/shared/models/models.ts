export interface Car {
  id: number;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  currentKm: number;
  photoPath?: string;
}

export interface Item {
  id: number;
  carId: number;
  name: string;
  manufacturer: string;
  installedDate: string;
  installedKm: number;
  nextMaintenanceKm?: number;
  nextMaintenanceDate?: string;
  photoPath?: string;
  serialNumber?: string;
}

export interface ExtraCost {
  name: string;
  cost: number;
}

export interface MaintenanceEvent {
  id: number;
  itemId: number;
  maintenanceDate: string;
  kmCounter: number;
  itemCost: number;
  extraCosts: ExtraCost[];
  notes?: string;
}

export interface DashboardStats {
  totalCars: number;
  totalItems: number;
  maintenanceThisMonth: number;
  upcomingMaintenance: number;
}
