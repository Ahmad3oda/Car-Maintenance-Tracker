import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './core/layouts/admin-layout/admin-layout.component';

// Feature pages are lazy-loaded so the initial bundle only carries the shell.
export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'cars',
        loadComponent: () =>
          import('./features/cars/car-list/car-list.component').then(
            (m) => m.CarListComponent,
          ),
      },
      {
        path: 'cars/add',
        loadComponent: () =>
          import('./features/cars/car-form/car-form.component').then(
            (m) => m.CarFormComponent,
          ),
      },
      {
        path: 'cars/:id/edit',
        loadComponent: () =>
          import('./features/cars/car-form/car-form.component').then(
            (m) => m.CarFormComponent,
          ),
      },
      {
        path: 'cars/:id',
        loadComponent: () =>
          import('./features/cars/car-details/car-details.component').then(
            (m) => m.CarDetailsComponent,
          ),
      },
      {
        path: 'cars/:id/items/add',
        loadComponent: () =>
          import('./features/items/item-form/item-form.component').then(
            (m) => m.ItemFormComponent,
          ),
      },
      {
        path: 'cars/:carId/items/:itemId/edit',
        loadComponent: () =>
          import('./features/items/item-form/item-form.component').then(
            (m) => m.ItemFormComponent,
          ),
      },
      {
        path: 'cars/:carId/items/:itemId/events',
        loadComponent: () =>
          import('./features/maintenance/event-list/event-list.component').then(
            (m) => m.EventListComponent,
          ),
      },
      {
        path: 'cars/:carId/items/:itemId/events/add',
        loadComponent: () =>
          import('./features/maintenance/event-form/event-form.component').then(
            (m) => m.EventFormComponent,
          ),
      },
      {
        path: 'cars/:carId/items/:itemId/events/:eventId/edit',
        loadComponent: () =>
          import('./features/maintenance/event-form/event-form.component').then(
            (m) => m.EventFormComponent,
          ),
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./features/maintenance/all-events/all-events.component').then(
            (m) => m.AllEventsComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
