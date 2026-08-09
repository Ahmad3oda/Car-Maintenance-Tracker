import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CarService } from '../../../core/services/car.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { CarDto } from '../../../shared/models/api.models';

import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, RouterModule, EmptyStateComponent],
  templateUrl: './car-list.component.html',
})
export class CarListComponent implements OnInit {
  cars: CarDto[] = [];
  loading = true;
  constructor(
    private carService: CarService,
    private router: Router,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.carService.getCarsList({ limit: 50, sortBy: 'brand' }).subscribe({
      next: (cars) => {
        this.cars = cars;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onDelete(id: number, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.carService.deleteCar(id).subscribe({
        next: () => {
          this.cars = this.cars.filter((c) => c.id !== id);
          this.notificationService.showSuccess('Car deleted successfully');
        },
        error: () => {},
      });
    }
  }

  getCarPhotoUrl(photoPath?: string | null): string | null {
    return this.carService.getPhotoUrl(photoPath);
  }

  navigateToAddCar() {
    this.router.navigate(['/cars/add']);
  }
}
