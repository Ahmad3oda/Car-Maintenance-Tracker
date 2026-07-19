import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Car } from '../../shared/models/models';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private mockCars: Car[] = [
    { id: 1, plateNumber: 'ABC-123', brand: 'Toyota', model: 'Camry', year: 2018, currentKm: 54000, photoPath: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=200&auto=format&fit=crop' },
    { id: 2, plateNumber: 'XYZ-987', brand: 'Honda', model: 'Civic', year: 2020, currentKm: 32000, photoPath: 'https://images.unsplash.com/photo-1590362891991-f702315fa418?q=80&w=200&auto=format&fit=crop' },
    { id: 3, plateNumber: 'DEF-456', brand: 'Ford', model: 'Focus', year: 2015, currentKm: 85000, photoPath: 'https://images.unsplash.com/photo-1611016186353-9af58c69a533?q=80&w=200&auto=format&fit=crop' },
  ];

  private carsSubject = new BehaviorSubject<Car[]>(this.mockCars);

  getCars(): Observable<Car[]> {
    return this.carsSubject.asObservable();
  }

  getCar(id: number): Observable<Car | undefined> {
    const car = this.mockCars.find(c => c.id === id);
    return of(car);
  }

  addCar(car: Partial<Car>): Observable<Car> {
    const newCar: Car = {
      ...car,
      id: this.mockCars.length + 1
    } as Car;
    this.mockCars.push(newCar);
    this.carsSubject.next([...this.mockCars]);
    return of(newCar);
  }

  updateCar(id: number, updates: Partial<Car>): Observable<Car> {
    const index = this.mockCars.findIndex(c => c.id === id);
    if (index !== -1) {
      this.mockCars[index] = { ...this.mockCars[index], ...updates };
      this.carsSubject.next([...this.mockCars]);
      return of(this.mockCars[index]);
    }
    throw new Error('Car not found');
  }
}
