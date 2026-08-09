import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../../../core/services/car.service';
import { ItemService } from '../../../core/services/item.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CarDto, ItemDto } from '../../../shared/models/api.models';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [CommonModule, RouterModule, EmptyStateComponent],
  templateUrl: './car-details.component.html',
})
export class CarDetailsComponent implements OnInit {
  car?: CarDto;
  items: ItemDto[] = [];
  carId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService,
    private itemService: ItemService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) {
        this.carId = id;
        this.loadCarData();
      }
    });
  }

  loadCarData() {
    this.carService.getCar(this.carId).subscribe({
      next: (car) => (this.car = car),
      error: () => {},
    });

    this.itemService.getItemsForCar(this.carId).subscribe({
      next: (items) => (this.items = items),
      error: () => {},
    });
  }

  getCarPhotoUrl(path?: string | null): string | null {
    return this.carService.getPhotoUrl(path);
  }

  getItemPhotoUrl(path?: string | null): string | null {
    return this.itemService.getPhotoUrl(path);
  }

  getLastInstallmentDate(item: ItemDto): string | Date | null {
    return item.lastInstallment || item.lastMaintenanceDate || item.installedDate || null;
  }

  onDeleteItem(itemId: number, event: Event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this item?')) {
      this.itemService.deleteItem(itemId).subscribe({
        next: () => {
          this.items = this.items.filter((i) => i.id !== itemId);
          this.notificationService.showSuccess('Item deleted successfully');
        },
        error: () => {},
      });
    }
  }

  navigateToAddItem() {
    this.router.navigate(['/cars', this.carId, 'items', 'add']);
  }

  navigateToEvents(itemId: number) {
    this.router.navigate(['/cars', this.carId, 'items', itemId, 'events']);
  }
}
