import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CreateMaintenanceRecordDto, MaintenanceRecordDto, Page, PageQuery } from '../../shared/models/api.models';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  private readonly http = inject(HttpClient);
  private readonly base = '/maintenance-records';

  getEventsForItem(itemId: number, query: PageQuery = {}): Observable<MaintenanceRecordDto[]> {
    return this.http
      .get<Page<MaintenanceRecordDto>>(this.base, { params: { ...query, itemId } as any })
      .pipe(map(page => page.data));
  }

  getEvent(id: number): Observable<MaintenanceRecordDto> {
    return this.http.get<MaintenanceRecordDto>(`${this.base}/${id}`);
  }

  createEvent(dto: CreateMaintenanceRecordDto): Observable<MaintenanceRecordDto> {
    return this.http.post<MaintenanceRecordDto>(this.base, dto);
  }

  updateEvent(id: number, dto: Partial<CreateMaintenanceRecordDto>): Observable<MaintenanceRecordDto> {
    return this.http.patch<MaintenanceRecordDto>(`${this.base}/${id}`, dto);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
