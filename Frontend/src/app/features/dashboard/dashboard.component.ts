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
import { UrgencyBadgeComponent } from '../../shared/components/urgency-badge/urgency-badge.component';
import { OdometerModalComponent } from '../../shared/components/odometer-modal/odometer-modal.component';
import { ExpensesChartComponent } from '../../shared/components/expenses-chart/expenses-chart.component';

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
    UrgencyBadgeComponent,
    OdometerModalComponent,
    ExpensesChartComponent,
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
    this.odometerCarId = preselectCarId || null;
    this.isOdometerModalOpen = true;
  }

  closeOdometerModal() {
    this.isOdometerModalOpen = false;
  }

  onOdometerUpdated() {
    this.carService.getCarsList().subscribe((cars) => (this.carsList = cars));
    this.loadUpcomingItems();
    this.loadStats();
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
