import { Injectable, inject } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { CarService } from './car.service';
import { ItemService } from './item.service';
import { MaintenanceService } from './maintenance.service';
import { DashboardStats, MaintenanceRecordDto } from '../../shared/models/api.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private cars = inject(CarService);
  private items = inject(ItemService);
  private maintenance = inject(MaintenanceService);

  getStats(): Observable<DashboardStats> {
    return forkJoin({
      cars: this.cars.getCars({ limit: 1 }),
      items: this.items.getItemsForCar(0, { limit: 1 }), // or a dedicated count endpoint later
    }).pipe(
      map(({ cars }) => ({
        totalCars: cars.meta.totalItems,
        totalItems: 0,              // fetch separately or add backend /stats endpoint
        maintenanceThisMonth: 0,
        upcomingMaintenance: 0,
      }))
    );
  }

  getRecentEvents(): Observable<MaintenanceRecordDto[]> {
    return this.maintenance.getEventsForItem(0, { limit: 5, order: 'DESC', sortBy: 'createdAt' });
  }

  //TODO: Implement this
  // getUpcomingMaintenance(): Observable<MaintenanceRecordDto[]> {
  //   return this.maintenance.getEventsForItem(0, { limit: 5});
  // }
}