import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../../../core/services/car.service';
import { ItemService } from '../../../core/services/item.service';
import { Car, Item } from '../../../shared/models/models';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [CommonModule, RouterModule, EmptyStateComponent],
  templateUrl: './car-details.component.html'
})
export class CarDetailsComponent implements OnInit {
  car?: Car;
  items: Item[] = [];
  carId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService,
    private itemService: ItemService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.carId = id;
        this.carService.getCar(this.carId).subscribe(car => this.car = car);
        this.itemService.getItemsForCar(this.carId).subscribe(items => this.items = items);
      }
    });
  }

  navigateToAddItem() {
    this.router.navigate(['/cars', this.carId, 'items', 'add']);
  }

  navigateToEvents(itemId: number) {
    this.router.navigate(['/cars', this.carId, 'items', itemId, 'events']);
  }
}
