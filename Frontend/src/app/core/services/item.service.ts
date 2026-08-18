import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  CreateItemDto,
  ItemDto,
  Page,
  PageQuery,
  UpcomingItemDto,
  UpcomingQueryDto,
} from '../../shared/models/api.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private readonly http = inject(HttpClient);
  private readonly base = '/items';

  /** GET /items */
  getItems(
    query: PageQuery & Record<string, unknown> = {},
  ): Observable<Page<ItemDto>> {
    const params = this.toParams(query);
    return this.http.get<Page<ItemDto>>(this.base, { params });
  }

  /** GET /items list */
  getItemsList(
    query: PageQuery & Record<string, unknown> = {},
  ): Observable<ItemDto[]> {
    return this.getItems(query).pipe(map((page) => page.data));
  }

  /** GET /items?carId=:carId */
  getItemsForCar(carId: number, query: PageQuery = {}): Observable<ItemDto[]> {
    const params = this.toParams({ ...query, carId });
    return this.http
      .get<Page<ItemDto>>(this.base, { params })
      .pipe(map((page) => page.data));
  }

  /** GET /items?carId=:carId with full pagination */
  getItemsForCarPaged(carId: number, query: PageQuery = {}): Observable<Page<ItemDto>> {
    const params = this.toParams({ ...query, carId });
    return this.http.get<Page<ItemDto>>(this.base, { params });
  }

  /** GET /items/upcoming with filtering and pagination */
  getUpcomingItems(
    query: PageQuery & Record<string, unknown> = {},
  ): Observable<Page<import('../../shared/models/api.models').UpcomingItemDto>> {
    const params = this.toParams(query);
    return this.http.get<Page<import('../../shared/models/api.models').UpcomingItemDto>>(
      `${this.base}/upcoming`,
      { params },
    );
  }

  /** GET /items/:id */

  getItem(id: number): Observable<ItemDto> {
    return this.http.get<ItemDto>(`${this.base}/${id}`);
  }

  /** POST /items */
  createItem(dto: CreateItemDto | FormData): Observable<ItemDto> {
    return this.http.post<ItemDto>(this.base, dto);
  }

  /** Alias for createItem */
  addItem(dto: CreateItemDto | FormData): Observable<ItemDto> {
    return this.createItem(dto);
  }

  /** PATCH /items/:id */
  updateItem(
    id: number,
    dto: Partial<CreateItemDto> | FormData,
  ): Observable<ItemDto> {
    return this.http.patch<ItemDto>(`${this.base}/${id}`, dto);
  }

  /** DELETE /items/:id */
  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
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

  /** Get complete image URL for an item photo */
  getPhotoUrl(photoPath?: string | null): string | null {
    if (!photoPath) return null;
    if (
      photoPath.startsWith('http://') ||
      photoPath.startsWith('https://') ||
      photoPath.startsWith('blob:')
    ) {
      return photoPath;
    }
    return `${environment.apiUrl}/uploads/items/${photoPath}`;
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