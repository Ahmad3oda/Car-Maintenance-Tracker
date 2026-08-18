import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center p-12 text-center bg-white border border-gray-100 border-dashed rounded-xl dark:bg-gray-800 dark:border-gray-700">
      <div class="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
        <ng-content select="[icon]"></ng-content>
      </div>
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
  @Output() action = new EventEmitter<void>();

  onActionClick() {
    this.action.emit();
  }
}
