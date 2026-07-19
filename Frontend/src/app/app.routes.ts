import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './core/layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CarListComponent } from './features/cars/car-list/car-list.component';
import { CarFormComponent } from './features/cars/car-form/car-form.component';
import { CarDetailsComponent } from './features/cars/car-details/car-details.component';
import { ItemFormComponent } from './features/items/item-form/item-form.component';
import { EventListComponent } from './features/maintenance/event-list/event-list.component';
import { EventFormComponent } from './features/maintenance/event-form/event-form.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'cars', component: CarListComponent },
      { path: 'cars/add', component: CarFormComponent },
      { path: 'cars/:id/edit', component: CarFormComponent },
      { path: 'cars/:id', component: CarDetailsComponent },
      { path: 'cars/:id/items/add', component: ItemFormComponent },
      { path: 'cars/:carId/items/:itemId/edit', component: ItemFormComponent },
      { path: 'cars/:carId/items/:itemId/events', component: EventListComponent },
      { path: 'cars/:carId/items/:itemId/events/add', component: EventFormComponent },
      { path: 'cars/:carId/items/:itemId/events/:eventId/edit', component: EventFormComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];
