import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  CarDto,
  CreateCarDto,
  ExportCarDataDto,
  ImportCarDataDto,
  ImportResultDto,
  Page,
  PageQuery,
} from '../../shared/models/api.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CarService {
  private readonly http = inject(HttpClient);
  private readonly base = '/cars';

  /** GET /cars?page=1&limit=10&search=... */
  getCars(
    query: PageQuery & Record<string, unknown> = {},
  ): Observable<Page<CarDto>> {
    const params = this.toParams(query);
    return this.http.get<Page<CarDto>>(this.base, { params });
  }

  /** Convenience: returns just the data array */
  getCarsList(
    query: PageQuery & Record<string, unknown> = {},
  ): Observable<CarDto[]> {
    return this.getCars(query).pipe(map((page) => page.data));
  }

  /** GET /cars/:id */
  getCar(id: number): Observable<CarDto> {
    return this.http.get<CarDto>(`${this.base}/${id}`);
  }

  /** POST /cars */
  createCar(dto: CreateCarDto | FormData): Observable<CarDto> {
    return this.http.post<CarDto>(this.base, dto);
  }

  /** PATCH /cars/:id */
  updateCar(
    id: number,
    dto: Partial<CreateCarDto> | FormData,
  ): Observable<CarDto> {
    return this.http.patch<CarDto>(`${this.base}/${id}`, dto);
  }

  /** Quick update odometer for a car */
  updateOdometer(id: number, currentKm: number): Observable<CarDto> {
    return this.http.patch<CarDto>(`${this.base}/${id}`, { currentKm });
  }

  /** DELETE /cars/:id */
  deleteCar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  /** GET /cars/:id/export */
  exportCarData(id: number): Observable<ExportCarDataDto> {
    return this.http.get<ExportCarDataDto>(`${this.base}/${id}/export`);
  }

  /** Trigger download of exported JSON file */
  downloadExportedCarData(id: number, plateNumber?: string): Observable<ExportCarDataDto> {
    return this.exportCarData(id).pipe(
      map((data) => {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        const plate = plateNumber || data.car?.plateNumber || `car-${id}`;
        const cleanPlate = plate.replace(/[^a-zA-Z0-9_-]/g, '_');
        const dateStr = new Date().toISOString().split('T')[0];
        a.href = url;
        a.download = `maintenance-export-${cleanPlate}-${dateStr}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        return data;
      }),
    );
  }

  /** POST /cars/:id/import */
  importCarData(
    id: number,
    data: ImportCarDataDto,
  ): Observable<ImportResultDto> {
    return this.http.post<ImportResultDto>(`${this.base}/${id}/import`, data);
  }

  /** Helper to build FormData from a plain object + optional File */
  toFormData(data: Record<string, unknown>, photo?: File | null): FormData {
    const fd = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        key !== 'photoPath'
      ) {
        fd.append(key, String(value));
      }
    }
    if (photo) {
      fd.append('photoPath', photo);
    }
    return fd;
  }

  /** Get complete image URL for a car photo */
  getPhotoUrl(photoPath?: string | null): string | null {
    if (!photoPath) return null;
    if (photoPath.startsWith('http://') || photoPath.startsWith('https://') || photoPath.startsWith('blob:')) {
      return photoPath;
    }
    return `${environment.apiUrl}/uploads/cars/${photoPath}`;
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