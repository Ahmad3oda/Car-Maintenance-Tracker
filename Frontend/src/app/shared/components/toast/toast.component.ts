import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NotificationService,
  ToastNotification,
} from '../../../core/services/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed bottom-6 right-6 z-[99999] flex flex-col gap-3 max-w-sm w-full px-4 pointer-events-none transition-all duration-300"
      *ngIf="notifications$ | async as notifications"
    >
      <div
        *ngFor="let toast of notifications"
        class="pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-2xl border text-sm font-semibold transition-all transform ease-out duration-300"
        [ngClass]="{
          'bg-green-600 text-white border-green-700 dark:bg-green-600': toast.type === 'success',
          'bg-red-600 text-white border-red-700 dark:bg-red-600': toast.type === 'error',
          'bg-blue-600 text-white border-blue-700 dark:bg-blue-600': toast.type === 'info',
          'bg-orange-600 text-white border-orange-700 dark:bg-orange-600': toast.type === 'warning'
        }"
      >
        <div class="flex items-center space-x-3">
          <!-- Success Icon -->
          <svg
            *ngIf="toast.type === 'success'"
            class="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <!-- Error Icon -->
          <svg
            *ngIf="toast.type === 'error'"
            class="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <!-- Info Icon -->
          <svg
            *ngIf="toast.type === 'info'"
            class="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <!-- Warning Icon -->
          <svg
            *ngIf="toast.type === 'warning'"
            class="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>

          <span class="leading-tight">{{ toast.message }}</span>
        </div>

        <button
          (click)="onDismiss(toast.id)"
          class="ml-3 p-1 rounded-lg hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
          aria-label="Close"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  `,
})
export class ToastComponent {
  private notificationService = inject(NotificationService);
  notifications$: Observable<ToastNotification[]> =
    this.notificationService.notifications;

  onDismiss(id: string) {
    this.notificationService.remove(id);
  }
}
