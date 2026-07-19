import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Item } from '../../shared/models/models';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private mockItems: Item[] = [
    { id: 1, carId: 1, name: 'Engine Oil', manufacturer: 'Castrol', installedDate: '2023-05-10', installedKm: 48000, nextMaintenanceKm: 58000, nextMaintenanceDate: '2023-11-10', photoPath: undefined },
    { id: 2, carId: 1, name: 'Brake Pads', manufacturer: 'Brembo', installedDate: '2022-10-15', installedKm: 35000, nextMaintenanceKm: 75000, nextMaintenanceDate: '2024-10-15', photoPath: undefined },
    { id: 3, carId: 1, name: 'Air Filter', manufacturer: 'K&N', installedDate: '2023-01-20', installedKm: 40000, nextMaintenanceKm: 60000, nextMaintenanceDate: '2024-01-20', photoPath: undefined },
  ];

  private itemsSubject = new BehaviorSubject<Item[]>(this.mockItems);

  getItemsForCar(carId: number): Observable<Item[]> {
    const items = this.mockItems.filter(i => i.carId === carId);
    return of(items);
  }

  getItem(id: number): Observable<Item | undefined> {
    const item = this.mockItems.find(i => i.id === id);
    return of(item);
  }

  addItem(item: Partial<Item>): Observable<Item> {
    const newItem: Item = {
      ...item,
      id: this.mockItems.length + 1
    } as Item;
    this.mockItems.push(newItem);
    this.itemsSubject.next([...this.mockItems]);
    return of(newItem);
  }

  updateItem(id: number, updates: Partial<Item>): Observable<Item> {
    const index = this.mockItems.findIndex(i => i.id === id);
    if (index !== -1) {
      this.mockItems[index] = { ...this.mockItems[index], ...updates };
      this.itemsSubject.next([...this.mockItems]);
      return of(this.mockItems[index]);
    }
    throw new Error('Item not found');
  }
}
