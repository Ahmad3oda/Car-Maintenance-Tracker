import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MaintenanceService } from '../../../core/services/maintenance.service';
import { ItemService } from '../../../core/services/item.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ItemDto, MaintenanceRecordDto } from '../../../shared/models/api.models';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule, EmptyStateComponent],
  templateUrl: './event-list.component.html',
})
export class EventListComponent implements OnInit {
  events: MaintenanceRecordDto[] = [];
  item?: ItemDto;
  carId!: number;
  itemId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private maintenanceService: MaintenanceService,
    private itemService: ItemService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.carId = Number(params.get('carId'));
      this.itemId = Number(params.get('itemId'));

      if (this.itemId) {
        this.loadData();
      }
    });
  }

  loadData() {
    this.itemService.getItem(this.itemId).subscribe({
      next: (item) => (this.item = item),
      error: () => {},
    });

    this.maintenanceService.getEventsForItem(this.itemId).subscribe({
      next: (events) => (this.events = events),
      error: () => {},
    });
  }

  getItemPhotoUrl(path?: string | null): string | null {
    return this.itemService.getPhotoUrl(path);
  }

  getTotalCost(event: MaintenanceRecordDto): number {
    if (event.totalCost !== undefined && event.totalCost !== null) {
      return Number(event.totalCost);
    }
    let total = Number(event.itemCost || 0);
    if (event.extraCosts && Array.isArray(event.extraCosts)) {
      total += event.extraCosts.reduce(
        (sum, cost) => sum + Number(cost.cost || 0),
        0,
      );
    }
    return total;
  }

  onDeleteEvent(id: number) {
    if (confirm('Are you sure you want to delete this maintenance record?')) {
      this.maintenanceService.deleteEvent(id).subscribe({
        next: () => {
          this.events = this.events.filter((e) => e.id !== id);
          this.notificationService.showSuccess(
            'Maintenance record deleted successfully',
          );
        },
        error: () => {},
      });
    }
  }

  navigateToAddEvent() {
    this.router.navigate([
      '/cars',
      this.carId,
      'items',
      this.itemId,
      'events',
      'add',
    ]);
  }
}
