import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, catchError, forkJoin } from 'rxjs';
import { ItemService } from './item.service';
import { MaintenanceService } from './maintenance.service';
import {
  DashboardStats,
  MaintenanceRecordDto,
  Page,
} from '../../shared/models/api.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private items = inject(ItemService);
  private maintenance = inject(MaintenanceService);

  /** GET /dashboard/stats — computed server-side over all records. */
  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>('/dashboard/stats');
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

  getUpcomingMaintenancePaged(
    query: import('../../shared/models/api.models').UpcomingQueryDto = {},
  ): Observable<Page<import('../../shared/models/api.models').UpcomingItemDto>> {
    return this.items.getUpcomingItems(query);
  }

  getDueAlertsSummary(): Observable<{
    overdue: number;
    dueSoon: number;
    totalDue: number;
    items: import('../../shared/models/api.models').UpcomingItemDto[];
  }> {
    // Counts come from each scope's total, not from the 10 items shown.
    return forkJoin({
      due: this.items.getUpcomingItems({ scope: 'due_soon_or_overdue', limit: 10 }),
      overdue: this.items.getUpcomingItems({ scope: 'overdue_only', limit: 1 }),
    }).pipe(
      map(({ due, overdue }) => {
        const items = due.data || [];
        const totalDue = due.meta?.totalItems ?? items.length;
        const overdueCount = overdue.meta?.totalItems ?? 0;
        return {
          overdue: overdueCount,
          dueSoon: Math.max(totalDue - overdueCount, 0),
          totalDue,
          items,
        };
      }),
      catchError(() => of({ overdue: 0, dueSoon: 0, totalDue: 0, items: [] })),
    );
  }
}