import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MaintenanceService } from '../../../core/services/maintenance.service';
import { CarService } from '../../../core/services/car.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CarDto, MaintenanceRecordDto, Page, PageMeta } from '../../../shared/models/api.models';
import { DataTableComponent } from '../../../shared/components/table/data-table.component';
import { SortHeaderComponent } from '../../../shared/components/table/sort-header.component';
import { ImageModalComponent } from '../../../shared/components/image-modal/image-modal.component';

export type TimePeriod = 'lifetime' | 'day' | 'week' | 'month' | 'year';

@Component({
  selector: 'app-all-events',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    DataTableComponent,
    SortHeaderComponent,
    ImageModalComponent,
  ],
  templateUrl: './all-events.component.html',
})
export class AllEventsComponent implements OnInit {
  events: MaintenanceRecordDto[] = [];
  eventsMeta?: PageMeta;
  loadingEvents = true;

  carsList: CarDto[] = [];
  selectedCarId: number | null = null;
  selectedPeriod: TimePeriod = 'lifetime';
  searchQuery = '';

  page = 1;
  limit = 10;
  sortBy = 'maintenanceDate';
  order: 'ASC' | 'DESC' = 'DESC';

  // Image Modal
  isImageModalOpen = false;
  modalImageUrl = '';
  modalImageTitle = '';

  constructor(
    private maintenanceService: MaintenanceService,
    private carService: CarService,
    private notificationService: NotificationService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadCars();
    this.loadEvents();
  }

  loadCars() {
    this.carService.getCarsList({ limit: 100, sortBy: 'brand' }).subscribe({
      next: (cars) => {
        this.carsList = cars;
      },
      error: () => {},
    });
  }

  loadEvents() {
    this.loadingEvents = true;

    const { startDate, endDate } = this.calculatePeriodDates(this.selectedPeriod);

    this.maintenanceService
      .getAllEvents({
        page: this.page,
        limit: this.limit,
        sortBy: this.sortBy,
        order: this.order,
        carId: this.selectedCarId || undefined,
        search: this.searchQuery.trim() || undefined,
        startDate,
        endDate,
      })
      .subscribe({
        next: (res: Page<MaintenanceRecordDto>) => {
          this.events = res.data;
          this.eventsMeta = res.meta;
          this.loadingEvents = false;
        },
        error: () => {
          this.loadingEvents = false;
        },
      });
  }

  calculatePeriodDates(period: TimePeriod): { startDate?: string; endDate?: string } {
    if (period === 'lifetime') return {};

    const now = new Date();
    const startDate = new Date();
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    switch (period) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate.setDate(now.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
    }

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  }

  onPeriodChange(period: TimePeriod) {
    if (this.selectedPeriod !== period) {
      this.selectedPeriod = period;
      this.page = 1;
      this.loadEvents();
    }
  }

  onCarFilterChange(carIdVal: any) {
    this.selectedCarId = carIdVal ? Number(carIdVal) : null;
    this.page = 1;
    this.loadEvents();
  }

  onSearchInput(query: string) {
    this.searchQuery = query;
    this.page = 1;
    this.loadEvents();
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadEvents();
  }

  onLimitChange(newLimit: number) {
    this.limit = newLimit;
    this.page = 1;
    this.loadEvents();
  }

  onSortChange(event: { sortBy: string; order: 'ASC' | 'DESC' }) {
    this.sortBy = event.sortBy;
    this.order = event.order;
    this.page = 1;
    this.loadEvents();
  }

  onDeleteEvent(id: number, event?: Event) {
    if (event) event.stopPropagation();
    if (confirm('Are you sure you want to delete this maintenance record?')) {
      this.maintenanceService.deleteEvent(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Record deleted successfully');
          this.loadEvents();
        },
        error: () => {},
      });
    }
  }

  getTotalCost(record: MaintenanceRecordDto): number {
    if (record.totalCost !== undefined && record.totalCost !== null) {
      return record.totalCost;
    }
    const extraCostTotal = (record.extraCosts || []).reduce(
      (sum, item) => sum + (Number(item.cost) || 0),
      0,
    );
    return (Number(record.itemCost) || 0) + extraCostTotal;
  }

  getItemName(record: any): string {
    if (record.item && record.item.name) return record.item.name;
    if (record.itemName) return record.itemName;
    return 'Item #' + record.itemId;
  }

  getPhotoUrl(photoPath?: string | null): string | null {
    return this.maintenanceService.getPhotoUrl(photoPath);
  }

  openImageModal(url: string, title: string) {
    this.modalImageUrl = url;
    this.modalImageTitle = title;
    this.isImageModalOpen = true;
  }

  closeImageModal() {
    this.isImageModalOpen = false;
    this.modalImageUrl = '';
    this.modalImageTitle = '';
  }
}
