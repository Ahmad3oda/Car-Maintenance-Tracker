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
      class="fixed bottom-6 right-6 z-[999999] flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none"
      *ngIf="notifications$ | async as notifications"
    >
      <div
        *ngFor="let toast of notifications"
        class="toast-item pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-2xl border text-sm font-medium text-white transition-all duration-300"
        [ngClass]="'toast-' + toast.type"
      >
        <div class="flex items-center space-x-3 text-white overflow-hidden mr-2">
          <!-- Success Icon -->
          <svg
            *ngIf="toast.type === 'success'"
            class="w-5 h-5 flex-shrink-0 text-white"
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
            class="w-5 h-5 flex-shrink-0 text-white"
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
            class="w-5 h-5 flex-shrink-0 text-white"
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
            class="w-5 h-5 flex-shrink-0 text-white"
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

          <span class="leading-snug text-white font-medium break-words">{{ toast.message }}</span>
        </div>

        <button
          (click)="onDismiss(toast.id)"
          class="p-1 rounded-lg text-white hover:bg-white/20 focus:outline-none transition-colors shrink-0"
          aria-label="Close"
        >
          <svg
            class="w-4 h-4 text-white"
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
  styles: [`
    .toast-item {
      animation: toastSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    /* 700 shades: white text >= 5:1 (WCAG AA). */
    .toast-success {
      background-color: rgb(var(--green-700)) !important;
      border-color: rgb(var(--green-800)) !important;
      color: rgb(var(--white)) !important;
      box-shadow: 0 10px 25px -5px rgb(var(--green-700) / 0.4), 0 8px 10px -6px rgb(var(--green-700) / 0.3) !important;
    }
    .toast-error {
      background-color: rgb(var(--red-700)) !important;
      border-color: rgb(var(--red-800)) !important;
      color: rgb(var(--white)) !important;
      box-shadow: 0 10px 25px -5px rgb(var(--red-700) / 0.4), 0 8px 10px -6px rgb(var(--red-700) / 0.3) !important;
    }
    .toast-info {
      background-color: rgb(var(--blue-700)) !important;
      border-color: rgb(var(--blue-800)) !important;
      color: rgb(var(--white)) !important;
      box-shadow: 0 10px 25px -5px rgb(var(--blue-700) / 0.4), 0 8px 10px -6px rgb(var(--blue-700) / 0.3) !important;
    }
    .toast-warning {
      background-color: rgb(var(--amber-700)) !important;
      border-color: rgb(var(--amber-800)) !important;
      color: rgb(var(--white)) !important;
      box-shadow: 0 10px 25px -5px rgb(var(--amber-700) / 0.4), 0 8px 10px -6px rgb(var(--amber-700) / 0.3) !important;
    }
    @keyframes toastSlideUp {
      from {
        opacity: 0;
        transform: translateY(16px) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `]
})
export class ToastComponent {
  private notificationService = inject(NotificationService);
  notifications$: Observable<ToastNotification[]> =
    this.notificationService.notifications;

  onDismiss(id: string) {
    this.notificationService.remove(id);
  }
}
