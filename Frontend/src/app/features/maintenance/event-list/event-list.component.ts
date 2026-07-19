import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MaintenanceService } from '../../../core/services/maintenance.service';
import { ItemService } from '../../../core/services/item.service';
import { MaintenanceEvent, Item } from '../../../shared/models/models';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule, EmptyStateComponent],
  templateUrl: './event-list.component.html'
})
export class EventListComponent implements OnInit {
  events: MaintenanceEvent[] = [];
  item?: Item;
  carId!: number;
  itemId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private maintenanceService: MaintenanceService,
    private itemService: ItemService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.carId = Number(params.get('carId'));
      this.itemId = Number(params.get('itemId'));
      
      if (this.itemId) {
        this.itemService.getItem(this.itemId).subscribe(item => this.item = item);
        this.maintenanceService.getEventsForItem(this.itemId).subscribe(events => this.events = events);
      }
    });
  }

  navigateToAddEvent() {
    this.router.navigate(['/cars', this.carId, 'items', this.itemId, 'events', 'add']);
  }
}
