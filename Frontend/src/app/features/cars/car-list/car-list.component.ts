import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CarService } from '../../../core/services/car.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { CarDto } from '../../../shared/models/api.models';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, RouterModule, EmptyStateComponent],
  templateUrl: './car-list.component.html',
})
export class CarListComponent implements OnInit {
  cars: CarDto[] = [];
  loading = true;
  constructor(private carService: CarService, private router: Router) {}

  ngOnInit() {
    this.carService.getCarsList({ limit: 50, sortBy: 'brand' }).subscribe({
      next: (cars) => {
        this.cars = cars;
        this.loading = false;
      },
      error: () => (this.loading = false), // error toast handled by interceptor
    });
  }
  
  onDelete(id: number) {
    this.carService.deleteCar(id).subscribe(() => {
      this.cars = this.cars.filter((c) => c.id !== id);
    });
  }

  navigateToAddCar() {
    this.router.navigate(['/cars/add']);
  }
}
