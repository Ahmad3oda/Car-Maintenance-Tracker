import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardStats, MaintenanceEvent } from '../../shared/models/models';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    StatCardComponent,
    TableComponent,
    EmptyStateComponent
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  stats!: DashboardStats;
  recentEvents: (MaintenanceEvent & { carName: string; itemName: string })[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getStats().subscribe(stats => this.stats = stats);
    this.dashboardService.getRecentMaintenance().subscribe(events => this.recentEvents = events);
  }
}
