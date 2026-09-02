import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type UrgencyStatus = 'OVERDUE' | 'DUE_SOON' | 'UPCOMING' | 'HEALTHY';

@Component({
  selector: 'app-urgency-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container [ngSwitch]="status">
      <!-- Overdue: Red -->
      <span
        *ngSwitchCase="'OVERDUE'"
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/40 dark:text-red-200 dark:border-red-700"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
        Overdue
      </span>

      <!-- Due Soon: Yellow -->
      <span
        *ngSwitchCase="'DUE_SOON'"
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-200 dark:border-yellow-700"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
        Due Soon
      </span>

      <!-- Upcoming: Blue -->
      <span
        *ngSwitchCase="'UPCOMING'"
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-700"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
        Upcoming
      </span>

      <!-- Healthy: Green / Default -->
      <span
        *ngSwitchDefault
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300 dark:bg-green-900/40 dark:text-green-200 dark:border-green-700"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
        Healthy
      </span>
    </ng-container>
  `
})
export class UrgencyBadgeComponent {
  @Input() status: UrgencyStatus | string = 'HEALTHY';
}
