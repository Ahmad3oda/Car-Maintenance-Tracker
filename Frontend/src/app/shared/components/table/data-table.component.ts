import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../pagination/pagination.component';
import { PageMeta } from '../../models/api.models';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  template: `
    <div class="w-full overflow-hidden rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 mb-8 transition-all duration-200">
      
      <!-- Table Scrollable Container -->
      <div class="w-full overflow-x-auto relative">
        <!-- Loading overlay -->
        <div
          *ngIf="loading"
          class="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xs z-20 flex items-center justify-center min-h-[160px]"
        >
          <div class="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
            <svg class="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-sm font-medium">Loading data...</span>
          </div>
        </div>

        <table class="w-full whitespace-nowrap text-left">
          <thead class="sticky top-0 bg-gray-50/90 dark:bg-gray-800/90 backdrop-blur-xs border-b border-gray-100 dark:border-gray-700 z-10">
            <tr class="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
              <ng-content select="[table-head]"></ng-content>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-700/80 bg-white dark:bg-gray-800">
            <ng-content select="[table-body]"></ng-content>
          </tbody>
        </table>
      </div>

      <!-- Integrated Pagination Footer -->
      <app-pagination
        *ngIf="meta"
        [page]="meta.page"
        [limit]="meta.limit"
        [totalItems]="meta.totalItems"
        [totalPages]="meta.totalPages"
        [pageSizeOptions]="pageSizeOptions"
        (pageChange)="pageChange.emit($event)"
        (limitChange)="limitChange.emit($event)"
      ></app-pagination>
    </div>
  `,
})
export class DataTableComponent {
  @Input() meta?: PageMeta;
  @Input() loading = false;
  @Input() pageSizeOptions = [5, 10, 20, 50];

  @Output() pageChange = new EventEmitter<number>();
  @Output() limitChange = new EventEmitter<number>();
}
