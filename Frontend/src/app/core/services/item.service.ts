import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ItemDto, Page, PageQuery } from '../../shared/models/api.models';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private readonly http = inject(HttpClient);
  private readonly base = '/items';

  getItemsForCar(carId: number, query: PageQuery = {}): Observable<ItemDto[]> {
    return this.http
      .get<Page<ItemDto>>(this.base, { params: { ...query, carId } as any })
      .pipe(map(page => page.data));
  }

  getItem(id: number): Observable<ItemDto> {
    return this.http.get<ItemDto>(`${this.base}/${id}`);
  }

  createItem(dto: FormData): Observable<ItemDto> {
    // FormData already contains carId, name, photo, etc.
    // Do NOT set Content-Type — browser sets boundary automatically
    return this.http.post<ItemDto>(this.base, dto);
  }

  updateItem(id: number, dto: FormData): Observable<ItemDto> {
    return this.http.patch<ItemDto>(`${this.base}/${id}`, dto);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  /** Helper to build FormData from a plain object + optional File */
  toFormData(data: Record<string, unknown>, photo?: File): FormData {
    const fd = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        fd.append(key, String(value));
      }
    }
    if (photo) fd.append('photo', photo);
    return fd;
  }
}