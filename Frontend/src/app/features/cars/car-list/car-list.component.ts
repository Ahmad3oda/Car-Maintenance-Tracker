import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CarService } from '../../../core/services/car.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { CarDto, PageMeta } from '../../../shared/models/api.models';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

import { NotificationService } from '../../../core/services/notification.service';
import { AuthImagePipe } from '../../../shared/pipes/auth-image.pipe';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { PlateComponent } from '../../../shared/components/plate/plate.component';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [PlateComponent, IconComponent, AuthImagePipe, CommonModule, RouterModule, EmptyStateComponent, PaginationComponent],
  templateUrl: './car-list.component.html',
})
export class CarListComponent implements OnInit {
  cars: CarDto[] = [];
  meta?: PageMeta;
  loading = true;
  page = 1;
  limit = 12;
  readonly pageSizeOptions = [6, 12, 24, 48];

  constructor(
    private carService: CarService,
    private router: Router,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.loadCars();
  }

  loadCars() {
    this.carService
      .getCars({ page: this.page, limit: this.limit, sortBy: 'brand' })
      .subscribe({
        next: (res) => {
          // Deleting the last car on a page leaves it empty: step back one.
          if (res.data.length === 0 && this.page > 1) {
            this.page--;
            this.loadCars();
            return;
          }
          this.cars = res.data;
          this.meta = res.meta;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }

  onPageChange(page: number) {
    this.page = page;
    this.loadCars();
  }

  onLimitChange(limit: number) {
    this.limit = limit;
    this.page = 1;
    this.loadCars();
  }

  onDelete(id: number, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.carService.deleteCar(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Car deleted successfully');
          // Reload so the next page's first car moves up and totals stay right.
          this.loadCars();
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
