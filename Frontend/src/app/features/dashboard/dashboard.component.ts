import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../core/services/dashboard.service';
import { CarService } from '../../core/services/car.service';
import { NotificationService } from '../../core/services/notification.service';
import {
  CarDto,
  DashboardStats,
  MaintenanceRecordDto,
  PageMeta,
  UpcomingItemDto,
  UpcomingScope,
} from '../../shared/models/api.models';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { DataTableComponent } from '../../shared/components/table/data-table.component';
import { SortHeaderComponent } from '../../shared/components/table/sort-header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    StatCardComponent,
    EmptyStateComponent,
    DataTableComponent,
    SortHeaderComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private carService = inject(CarService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  stats?: DashboardStats;
  carsList: CarDto[] = [];

  // --- Upcoming / Due Maintenance State ---
  upcomingItems: UpcomingItemDto[] = [];
  upcomingMeta?: PageMeta;
  loadingUpcoming = false;
  upcomingPage = 1;
  upcomingLimit = 5;
  upcomingSortBy = '';
  upcomingOrder: 'ASC' | 'DESC' = 'ASC';
  selectedCarFilter: number | null = null;
  selectedScopeFilter: 'due_soon_or_overdue' | 'overdue_only' | 'within_1k_km' | 'within_30_days' | 'all' = 'due_soon_or_overdue';

  // --- Quick Odometer Update Modal State ---
  isOdometerModalOpen = false;
  odometerCarId: number | null = null;
  odometerCurrentKm: number | null = null;
  odometerNewKm: number | null = null;
  isUpdatingOdometer = false;
  odometerError = '';

  // --- Recent Maintenance Events State ---
  recentEvents: (MaintenanceRecordDto & {
    carName: string;
    itemName: string;
  })[] = [];
  eventsMeta?: PageMeta;
  currentPage = 1;
  currentLimit = 5;
  sortBy = 'maintenanceDate';
  order: 'ASC' | 'DESC' = 'DESC';
  loadingEvents = false;

  navigateToAddCar() {
    this.router.navigate(['/cars']);
  }

  ngOnInit() {
    this.loadStats();
    this.loadCars();
    this.loadUpcomingItems();
    this.loadRecentEvents();
  }

  loadStats() {
    this.dashboardService.getStats().subscribe({
      next: (stats) => (this.stats = stats),
      error: () => {},
    });
  }

  loadCars() {
    this.carService.getCarsList({ limit: 100 }).subscribe({
      next: (cars) => {
        this.carsList = cars;
        if (cars.length > 0 && !this.odometerCarId) {
          this.odometerCarId = cars[0].id;
          this.odometerCurrentKm = cars[0].currentKm;
          this.odometerNewKm = cars[0].currentKm;
        }
      },
      error: () => {},
    });
  }

  // --- Upcoming Maintenance Methods ---
  loadUpcomingItems() {
    this.loadingUpcoming = true;
    this.dashboardService
      .getUpcomingMaintenancePaged({
        page: this.upcomingPage,
        limit: this.upcomingLimit,
        carId: this.selectedCarFilter || undefined,
        scope: this.selectedScopeFilter,
        sortBy: this.upcomingSortBy || undefined,
        order: this.upcomingOrder,
      })
      .subscribe({
        next: (page) => {
          this.upcomingMeta = page.meta;
          this.upcomingItems = page.data || [];
          this.loadingUpcoming = false;
        },
        error: () => {
          this.loadingUpcoming = false;
        },
      });
  }

  onCarFilterChange(carId: any) {
    this.selectedCarFilter = carId ? Number(carId) : null;
    this.upcomingPage = 1;
    this.loadUpcomingItems();
  }

  onScopeFilterChange(scope: any) {
    this.selectedScopeFilter = scope;
    this.upcomingPage = 1;
    this.loadUpcomingItems();
  }

  onUpcomingSortChange(event: { sortBy: string; order: 'ASC' | 'DESC' }) {
    this.upcomingSortBy = event.sortBy;
    this.upcomingOrder = event.order;
    this.upcomingPage = 1;
    this.loadUpcomingItems();
  }

  onUpcomingPageChange(page: number) {
    this.upcomingPage = page;
    this.loadUpcomingItems();
  }

  onUpcomingLimitChange(limit: number) {
    this.upcomingLimit = limit;
    this.upcomingPage = 1;
    this.loadUpcomingItems();
  }

  // --- Quick Odometer Modal Methods ---
  openOdometerModal(preselectCarId?: number) {
    if (this.carsList.length === 0) return;

    if (preselectCarId) {
      this.odometerCarId = preselectCarId;
    } else if (!this.odometerCarId || !this.carsList.some((c) => c.id === Number(this.odometerCarId))) {
      this.odometerCarId = this.carsList[0].id;
    }

    this.updateOdometerModalValues(true);
    this.odometerError = '';
    this.isOdometerModalOpen = true;
  }

  closeOdometerModal() {
    this.isOdometerModalOpen = false;
    this.odometerError = '';
    this.odometerNewKm = null;
  }

  onOdometerCarChange() {
    this.updateOdometerModalValues(true);
  }

  private updateOdometerModalValues(resetInput = false) {
    const selected = this.carsList.find((c) => c.id === Number(this.odometerCarId));
    if (selected) {
      this.odometerCurrentKm = selected.currentKm || 0;
      if (resetInput) {
        this.odometerNewKm = null;
      }
    }
  }

  submitOdometerUpdate() {
    if (!this.odometerCarId) {
      this.odometerError = 'Please select a vehicle.';
      return;
    }

    if (this.odometerNewKm === null || this.odometerNewKm === undefined || this.odometerNewKm < 0) {
      this.odometerError = 'Please enter a valid non-negative mileage.';
      return;
    }

    const selectedCar = this.carsList.find((c) => c.id === Number(this.odometerCarId));
    this.isUpdatingOdometer = true;
    this.odometerError = '';

    this.carService.updateOdometer(Number(this.odometerCarId), Number(this.odometerNewKm)).subscribe({
      next: (updatedCar) => {
        this.isUpdatingOdometer = false;
        this.closeOdometerModal();

        // Update local car state
        const idx = this.carsList.findIndex((c) => c.id === updatedCar.id);
        if (idx !== -1) {
          this.carsList[idx] = updatedCar;
        }

        const carName = selectedCar ? `${selectedCar.brand} ${selectedCar.model}` : `Car #${updatedCar.id}`;
        this.notificationService.showSuccess(
          `Odometer for ${carName} updated to ${updatedCar.currentKm.toLocaleString()} KM. Maintenance schedule recalculated!`,
          5000,
        );

        // Instantly reload dashboard upcoming items and stats
        this.loadUpcomingItems();
        this.loadStats();
      },
      error: (err) => {
        this.isUpdatingOdometer = false;
        this.odometerError = err?.error?.message || 'Failed to update odometer. Please try again.';
      },
    });
  }

  // --- Recent Events Methods ---
  loadRecentEvents() {
    this.loadingEvents = true;
    this.dashboardService
      .getRecentMaintenancePaged(this.currentPage, this.currentLimit, this.sortBy, this.order)
      .subscribe({
        next: (page) => {
          this.eventsMeta = page.meta;
          this.recentEvents = (page.data || []).map((e: MaintenanceRecordDto) => ({
            ...e,
            carName: e.car
              ? `${e.car.brand} ${e.car.model}`
              : `Car #${e.carId}`,
            itemName: e.item ? e.item.name : `Item #${e.itemId}`,
          }));
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
    this.loadRecentEvents();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadRecentEvents();
  }

  onLimitChange(limit: number) {
    this.currentLimit = limit;
    this.currentPage = 1;
    this.loadRecentEvents();
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
}
