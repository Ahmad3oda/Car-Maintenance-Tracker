import { Injectable, inject } from '@angular/core';
import { forkJoin, map, Observable, of, catchError } from 'rxjs';
import { CarService } from './car.service';
import { ItemService } from './item.service';
import { MaintenanceService } from './maintenance.service';
import {
  DashboardStats,
  MaintenanceRecordDto,
  Page,
} from '../../shared/models/api.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private cars = inject(CarService);
  private items = inject(ItemService);
  private maintenance = inject(MaintenanceService);

  getStats(): Observable<DashboardStats> {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const oneYearAgo = new Date();
    oneYearAgo.setDate(now.getDate() - 365);

    const emptyCarsPage = {
      data: [],
      meta: {
        page: 1,
        limit: 1,
        totalItems: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    };

    const emptyItemsPage = {
      data: [],
      meta: {
        page: 1,
        limit: 1,
        totalItems: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    };

    const emptyRecordsPage = {
      data: [],
      meta: {
        page: 1,
        limit: 500,
        totalItems: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    };

    return forkJoin({
      cars: this.cars.getCars({ limit: 1 }).pipe(catchError(() => of(emptyCarsPage))),
      items: this.items.getItems({ limit: 1 }).pipe(catchError(() => of(emptyItemsPage))),
      records: this.maintenance
        .getAllEvents({ limit: 500 })
        .pipe(catchError(() => of(emptyRecordsPage))),
    }).pipe(
      map(({ cars, items, records }) => {
        const allRecords = records?.data || [];

        let itemsReplacedLastMonth = 0;
        let itemsReplacedLastYear = 0;
        let costSpentLastMonth = 0;
        let costSpentLastYear = 0;

        for (const record of allRecords) {
          if (!record.maintenanceDate) continue;
          const recDate = new Date(record.maintenanceDate);

          let totalRecordCost = Number(record.itemCost || 0);
          if (record.extraCosts && Array.isArray(record.extraCosts)) {
            totalRecordCost += record.extraCosts.reduce(
              (sum, ec) => sum + Number(ec.cost || 0),
              0,
            );
          }

          // Check last 30 days
          if (recDate >= thirtyDaysAgo && recDate <= now) {
            itemsReplacedLastMonth++;
            costSpentLastMonth += totalRecordCost;
          }

          // Check last 365 days
          if (recDate >= oneYearAgo && recDate <= now) {
            itemsReplacedLastYear++;
            costSpentLastYear += totalRecordCost;
          }
        }

        return {
          totalCars: cars?.meta?.totalItems ?? 0,
          totalItems: items?.meta?.totalItems ?? 0,
          itemsReplacedLastMonth,
          itemsReplacedLastYear,
          costSpentLastMonth,
          costSpentLastYear,
        };
      }),
    );
  }

  getRecentMaintenance(limit: number = 6): Observable<MaintenanceRecordDto[]> {
    return this.maintenance
      .getAllEvents({ limit, sortBy: 'maintenanceDate', order: 'DESC' })
      .pipe(
        map((page) => page.data || []),
        catchError(() => of([])),
      );
  }

  getRecentMaintenancePaged(
    page: number = 1,
    limit: number = 5,
    sortBy: string = 'maintenanceDate',
    order: 'ASC' | 'DESC' = 'DESC',
  ): Observable<Page<MaintenanceRecordDto>> {
    return this.maintenance.getAllEvents({ page, limit, sortBy, order });
  }

  getRecentEvents(limit: number = 6): Observable<MaintenanceRecordDto[]> {
    return this.getRecentMaintenance(limit);
  }
}