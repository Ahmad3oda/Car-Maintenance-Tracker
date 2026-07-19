import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DashboardStats, MaintenanceEvent } from '../../shared/models/models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  getStats(): Observable<DashboardStats> {
    return of({
      totalCars: 3,
      totalItems: 12,
      maintenanceThisMonth: 2,
      upcomingMaintenance: 5
    });
  }

  getRecentMaintenance(): Observable<(MaintenanceEvent & { carName: string; itemName: string })[]> {
    return of([
      { id: 1, itemId: 1, maintenanceDate: '2023-10-15', kmCounter: 54000, itemCost: 150.00, extraCosts: [{ name: 'Labor', cost: 50.00 }], notes: 'Regular oil change', carName: 'Toyota Camry (ABC-123)', itemName: 'Engine Oil' },
      { id: 2, itemId: 2, maintenanceDate: '2023-10-10', kmCounter: 35000, itemCost: 200.00, extraCosts: [], notes: '', carName: 'Toyota Camry (ABC-123)', itemName: 'Brake Pads' },
    ]);
  }
}
