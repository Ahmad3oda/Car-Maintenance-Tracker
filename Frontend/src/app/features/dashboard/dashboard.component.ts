import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardStats, MaintenanceRecordDto } from '../../shared/models/api.models';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    StatCardComponent,
    EmptyStateComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  stats?: DashboardStats;
  recentEvents: (MaintenanceRecordDto & {
    carName: string;
    itemName: string;
  })[] = [];

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

    this.dashboardService.getRecentMaintenance(6).subscribe({
      next: (events) => {
        this.recentEvents = (events || []).map((e) => ({
          ...e,
          carName: e.car
            ? `${e.car.brand} ${e.car.model}`
            : `Car #${e.carId}`,
          itemName: e.item ? e.item.name : `Item #${e.itemId}`,
        }));
      },
      error: () => {},
    });
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
