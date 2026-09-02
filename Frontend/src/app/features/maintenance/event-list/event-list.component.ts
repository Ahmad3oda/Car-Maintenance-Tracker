import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MaintenanceService } from '../../../core/services/maintenance.service';
import { ItemService } from '../../../core/services/item.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ItemDto, MaintenanceRecordDto, PageMeta } from '../../../shared/models/api.models';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ImageModalComponent } from '../../../shared/components/image-modal/image-modal.component';
import { DataTableComponent } from '../../../shared/components/table/data-table.component';
import { SortHeaderComponent } from '../../../shared/components/table/sort-header.component';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    EmptyStateComponent,
    ImageModalComponent,
    DataTableComponent,
    SortHeaderComponent,
  ],
  templateUrl: './event-list.component.html',
})
export class EventListComponent implements OnInit {
  events: MaintenanceRecordDto[] = [];
  eventsMeta?: PageMeta;
  item?: ItemDto;
  carId!: number;
  itemId!: number;
  currentPage = 1;
  currentLimit = 5;
  sortBy = 'maintenanceDate';
  order: 'ASC' | 'DESC' = 'DESC';
  loadingEvents = false;

  isImageModalOpen = false;
  modalImageUrl: string | null = null;
  modalImageTitle = '';

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
        this.loadItemData();
        this.loadEventsData();
      }
    });
  }

  loadItemData() {
    this.itemService.getItem(this.itemId).subscribe({
      next: (item) => (this.item = item),
      error: () => {},
    });
  }

  loadEventsData() {
    this.loadingEvents = true;
    this.maintenanceService
      .getEventsForItemPaged(this.itemId, {
        page: this.currentPage,
        limit: this.currentLimit,
        sortBy: this.sortBy,
        order: this.order,
      })
      .subscribe({
        next: (page) => {
          this.events = page.data || [];
          this.eventsMeta = page.meta;
          this.loadingEvents = false;
        },
        error: () => {
          this.loadingEvents = false;
        },
      });
  }

  onSortChange(event: { sortBy: string; order: 'ASC' | 'DESC' }) {
    this.sortBy = event.sortBy;
    this.order = event.order;
    this.currentPage = 1;
    this.loadEventsData();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadEventsData();
  }

  onLimitChange(limit: number) {
    this.currentLimit = limit;
    this.currentPage = 1;
    this.loadEventsData();
  }

  getItemPhotoUrl(path?: string | null): string | null {
    return this.itemService.getPhotoUrl(path);
  }

  openImageModal(url: string | null, title: string) {
    if (!url) return;
    this.modalImageUrl = url;
    this.modalImageTitle = title;
    this.isImageModalOpen = true;
  }

  closeImageModal() {
    this.isImageModalOpen = false;
    this.modalImageUrl = null;
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
          this.notificationService.showSuccess(
            'Maintenance record deleted successfully',
          );
          this.loadEventsData();
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
