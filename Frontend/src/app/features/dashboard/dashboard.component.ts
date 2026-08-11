import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardStats, MaintenanceRecordDto, PageMeta } from '../../shared/models/api.models';
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
    StatCardComponent,
    EmptyStateComponent,
    DataTableComponent,
    SortHeaderComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  stats?: DashboardStats;
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

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
  ) {}

  navigateToAddCar() {
    this.router.navigate(['/cars']);
  }

  ngOnInit() {
    this.dashboardService.getStats().subscribe({
      next: (stats) => (this.stats = stats),
      error: () => {},
    });

    this.loadRecentEvents();
  }

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
