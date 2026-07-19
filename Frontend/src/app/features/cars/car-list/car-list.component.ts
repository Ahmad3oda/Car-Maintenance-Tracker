import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CarService } from '../../../core/services/car.service';
import { Car } from '../../../shared/models/models';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, RouterModule, EmptyStateComponent],
  templateUrl: './car-list.component.html'
})
export class CarListComponent implements OnInit {
  cars: Car[] = [];

  constructor(private carService: CarService, private router: Router) {}

  ngOnInit() {
    this.carService.getCars().subscribe(cars => this.cars = cars);
  }

  navigateToAddCar() {
    this.router.navigate(['/cars/add']);
  }
}
