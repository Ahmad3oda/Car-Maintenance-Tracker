import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white border border-gray-100 rounded-xl dark:bg-gray-800 dark:border-gray-700">
      @if (illustration === 'car') {
        <!-- Original illustration: a car parked on a road, with an "add" badge. -->
        <svg class="w-44 h-auto mb-5" viewBox="0 0 160 96" fill="none" aria-hidden="true">
          <ellipse cx="80" cy="80" rx="50" ry="5" class="fill-gray-200 dark:fill-gray-700" />
          <path d="M10 86h28M52 86h28M94 86h28M136 86h14" class="stroke-gray-300 dark:stroke-gray-600" stroke-width="2" stroke-linecap="round" />
          <g class="text-purple-600 dark:text-purple-400" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.55" transform="translate(32 8) scale(4)">
            <path d="M5.1 16.5H3.75A.75.75 0 0 1 3 15.75V13.4a2 2 0 0 1 .42-1.23L5.3 9.2A3 3 0 0 1 7.67 8h6.06a3 3 0 0 1 2.14.9l2.63 2.6 1.87.42A2 2 0 0 1 22 13.87v1.88a.75.75 0 0 1-.75.75H18.9M8.9 16.5h6.2" />
            <path d="M5.5 11.6h12.6M11.5 8v3.6" />
            <circle cx="7" cy="16.5" r="1.9" />
            <circle cx="17" cy="16.5" r="1.9" />
            <circle cx="7" cy="16.5" r="0.5" fill="currentColor" />
            <circle cx="17" cy="16.5" r="0.5" fill="currentColor" />
          </g>
          <circle cx="132" cy="22" r="11" class="fill-purple-100 dark:fill-purple-900" />
          <path d="M132 17v10M127 22h10" class="stroke-purple-600 dark:stroke-purple-300" stroke-width="2.2" stroke-linecap="round" />
        </svg>
      } @else {
        <div class="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
          <ng-content select="[icon]"></ng-content>
        </div>
      }
      <h3 class="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">{{ title }}</h3>
      <p class="mb-6 text-sm text-gray-500 dark:text-gray-400 max-w-sm">{{ message }}</p>
      
      <button *ngIf="actionLabel" (click)="onActionClick()" class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900">
        {{ actionLabel }}
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-width: 0;
      max-width: 100%;
    }
  `]
})
export class EmptyStateComponent {
  @Input() title: string = 'No records found';
  @Input() message: string = 'Get started by creating a new record.';
  @Input() actionLabel?: string;
  /** A larger drawing instead of the icon slot. */
  @Input() illustration?: 'car';
  @Output() action = new EventEmitter<void>();

  onActionClick() {
    this.action.emit();
  }
}
