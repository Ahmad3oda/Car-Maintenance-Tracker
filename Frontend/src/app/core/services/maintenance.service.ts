import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MaintenanceEvent } from '../../shared/models/models';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private mockEvents: MaintenanceEvent[] = [
    { id: 1, itemId: 1, maintenanceDate: '2023-10-15', kmCounter: 54000, itemCost: 150.00, extraCosts: [{ name: 'Labor', cost: 50.00 }], notes: 'Regular oil change' },
    { id: 2, itemId: 1, maintenanceDate: '2023-05-10', kmCounter: 48000, itemCost: 140.00, extraCosts: [{ name: 'Labor', cost: 50.00 }], notes: 'Previous oil change' },
  ];

  private eventsSubject = new BehaviorSubject<MaintenanceEvent[]>(this.mockEvents);

  getEventsForItem(itemId: number): Observable<MaintenanceEvent[]> {
    const events = this.mockEvents.filter(e => e.itemId === itemId);
    return of(events);
  }

  addEvent(event: Partial<MaintenanceEvent>): Observable<MaintenanceEvent> {
    const newEvent: MaintenanceEvent = {
      ...event,
      id: this.mockEvents.length + 1
    } as MaintenanceEvent;
    this.mockEvents.push(newEvent);
    this.eventsSubject.next([...this.mockEvents]);
    return of(newEvent);
  }

  getEvent(id: number): Observable<MaintenanceEvent | undefined> {
    const event = this.mockEvents.find(e => e.id === id);
    return of(event);
  }

  updateEvent(id: number, updates: Partial<MaintenanceEvent>): Observable<MaintenanceEvent> {
    const index = this.mockEvents.findIndex(e => e.id === id);
    if (index !== -1) {
      this.mockEvents[index] = { ...this.mockEvents[index], ...updates };
      this.eventsSubject.next([...this.mockEvents]);
      return of(this.mockEvents[index]);
    }
    throw new Error('Event not found');
  }
}
