import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CarDto, CreateCarDto, Page, PageQuery } from '../../shared/models/api.models';

@Injectable({ providedIn: 'root' })
export class CarService {
  private readonly http = inject(HttpClient);
  private readonly base = '/cars';  // apiInterceptor prepends environment.apiUrl

  /** GET /cars?page=1&limit=10&search=... */
  getCars(query: PageQuery & Record<string, unknown>): Observable<Page<CarDto>> {
    const params = this.toParams(query);
    return this.http.get<Page<CarDto>>(this.base, { params });
  }

  /** Convenience: returns just the data array */
  getCarsList(query: PageQuery & Record<string, unknown> = {}): Observable<CarDto[]> {
    return this.getCars(query).pipe(map(page => page.data));
  }

  /** GET /cars/:id */
  getCar(id: number): Observable<CarDto> {
    return this.http.get<CarDto>(`${this.base}/${id}`);
  }

  /** POST /cars */
  createCar(dto: CreateCarDto): Observable<CarDto> {
    return this.http.post<CarDto>(this.base, dto);
  }

  /** PATCH /cars/:id */
  updateCar(id: number, dto: Partial<CreateCarDto>): Observable<CarDto> {
    return this.http.patch<CarDto>(`${this.base}/${id}`, dto);
  }

  /** DELETE /cars/:id */
  deleteCar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
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