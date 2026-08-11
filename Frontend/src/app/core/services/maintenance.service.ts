import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  CreateMaintenanceRecordDto,
  MaintenanceRecordDto,
  Page,
  PageQuery,
} from '../../shared/models/api.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  private readonly http = inject(HttpClient);
  private readonly base = '/maintenance-records';

  /** GET /maintenance-records */
  getAllEvents(
    query: PageQuery & Record<string, unknown> = {},
  ): Observable<Page<MaintenanceRecordDto>> {
    const params = this.toParams({
      sortBy: 'maintenanceDate',
      order: 'DESC',
      ...query,
    });
    return this.http.get<Page<MaintenanceRecordDto>>(this.base, { params });
  }

  /** Convenience list */
  getEventsList(
    query: PageQuery & Record<string, unknown> = {},
  ): Observable<MaintenanceRecordDto[]> {
    return this.getAllEvents(query).pipe(map((page) => page.data));
  }

  /** GET /maintenance-records?itemId=:itemId */
  getEventsForItem(
    itemId: number,
    query: PageQuery = {},
  ): Observable<MaintenanceRecordDto[]> {
    const params = this.toParams({
      sortBy: 'maintenanceDate',
      order: 'DESC',
      ...query,
      itemId,
    });
    return this.http
      .get<Page<MaintenanceRecordDto>>(this.base, { params })
      .pipe(map((page) => page.data));
  }

  /** GET /maintenance-records?itemId=:itemId with full pagination */
  getEventsForItemPaged(
    itemId: number,
    query: PageQuery = {},
  ): Observable<Page<MaintenanceRecordDto>> {
    const params = this.toParams({
      sortBy: 'maintenanceDate',
      order: 'DESC',
      ...query,
      itemId,
    });
    return this.http.get<Page<MaintenanceRecordDto>>(this.base, { params });
  }

  /** GET /maintenance-records/:id */
  getEvent(id: number): Observable<MaintenanceRecordDto> {
    return this.http.get<MaintenanceRecordDto>(`${this.base}/${id}`);
  }

  /** POST /maintenance-records */
  createEvent(
    dto: CreateMaintenanceRecordDto | FormData,
  ): Observable<MaintenanceRecordDto> {
    return this.http.post<MaintenanceRecordDto>(this.base, dto);
  }

  /** Alias for createEvent */
  addEvent(
    dto: CreateMaintenanceRecordDto | FormData,
  ): Observable<MaintenanceRecordDto> {
    return this.createEvent(dto);
  }

  /** PATCH /maintenance-records/:id */
  updateEvent(
    id: number,
    dto: Partial<CreateMaintenanceRecordDto> | FormData,
  ): Observable<MaintenanceRecordDto> {
    return this.http.patch<MaintenanceRecordDto>(`${this.base}/${id}`, dto);
  }

  /** DELETE /maintenance-records/:id */
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  /** Helper to build FormData from a plain object + optional File */
  toFormData(
    data: Record<string, unknown>,
    photo?: File | null,
  ): FormData {
    const fd = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        key !== 'photoPath'
      ) {
        if (key === 'extraCosts' && typeof value === 'object') {
          fd.append(key, JSON.stringify(value));
        } else {
          fd.append(key, String(value));
        }
      }
    }
    if (photo) {
      fd.append('photoPath', photo);
    }
    return fd;
  }

  /** Get complete image URL for a maintenance record photo */
  getPhotoUrl(photoPath?: string | null): string | null {
    if (!photoPath) return null;
    if (
      photoPath.startsWith('http://') ||
      photoPath.startsWith('https://') ||
      photoPath.startsWith('blob:')
    ) {
      return photoPath;
    }
    return `${environment.apiUrl}/uploads/maintenance-records/${photoPath}`;
  }

  private toParams(query: PageQuery & Record<string, unknown>): HttpParams {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    }
    return params;
  }
}
