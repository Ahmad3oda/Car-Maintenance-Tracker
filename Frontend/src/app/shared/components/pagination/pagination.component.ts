import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 dark:border-gray-700/80 bg-gray-50/60 dark:bg-gray-800/60 text-xs text-gray-500 dark:text-gray-400"
      *ngIf="totalItems > 0"
    >
      <!-- Results info & Page size selector -->
      <div class="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <div class="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-white dark:bg-gray-700/70 border border-gray-200/70 dark:border-gray-600/70 text-gray-600 dark:text-gray-300 shadow-2xs text-xs font-normal">
          <span>Showing</span>
          <span class="font-semibold text-gray-800 dark:text-gray-100">{{ startItem }}</span>
          <span>to</span>
          <span class="font-semibold text-gray-800 dark:text-gray-100">{{ endItem }}</span>
          <span>of</span>
          <span class="font-semibold text-purple-600 dark:text-purple-400">{{ totalItems }}</span>
          <span>entries</span>
        </div>

        <div class="flex items-center gap-1.5" *ngIf="showPageSize">
          <select
            id="pageSize"
            [value]="limit"
            (change)="onLimitSelect($event)"
            class="px-2 sm:px-2.5 py-1 sm:py-1.5 text-xs font-medium bg-white dark:bg-gray-700/70 border border-gray-200/70 dark:border-gray-600/70 rounded-xl text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400/30 hover:border-purple-300 dark:hover:border-purple-500 cursor-pointer shadow-2xs transition-colors"
          >
            <option *ngFor="let opt of pageSizeOptions" [value]="opt">{{ opt }} / page</option>
          </select>
        </div>
      </div>

      <!-- Pagination Buttons Container -->
      <div class="inline-flex items-center p-1 rounded-xl bg-gray-200/50 dark:bg-gray-700/60 border border-gray-200/50 dark:border-gray-600/50 gap-0.5 max-w-full overflow-x-auto" *ngIf="totalPages > 1">
        <!-- Previous Button -->
        <button
          (click)="changePage(page - 1)"
          [disabled]="page <= 1"
          class="h-7 sm:h-8 px-1.5 sm:px-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 hover:text-purple-600 dark:hover:text-purple-300 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center shrink-0"
          aria-label="Previous Page"
          title="Previous Page"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Numbered Page Buttons -->
        <ng-container *ngFor="let p of visiblePages">
          <span *ngIf="p === -1" class="h-7 sm:h-8 px-1.5 sm:px-2 text-gray-400 dark:text-gray-500 font-semibold select-none flex items-center justify-center text-xs">...</span>
          <button
            *ngIf="p !== -1"
            (click)="changePage(p)"
            [class.bg-purple-600]="p === page"
            [class.text-white]="p === page"
            [class.font-semibold]="p === page"
            [class.shadow-xs]="p === page"
            [class.text-gray-700]="p !== page"
            [class.dark:text-gray-300]="p !== page"
            [class.hover:bg-white]="p !== page"
            [class.dark:hover:bg-gray-600]="p !== page"
            [class.hover:text-purple-600]="p !== page"
            [class.dark:hover:text-purple-300]="p !== page"
            class="min-w-[28px] sm:min-w-[32px] h-7 sm:h-8 px-1.5 sm:px-2 rounded-lg text-2xs sm:text-xs transition-all flex items-center justify-center font-medium shrink-0"
          >
            {{ p }}
          </button>
        </ng-container>

        <!-- Next Button -->
        <button
          (click)="changePage(page + 1)"
          [disabled]="page >= totalPages"
          class="h-7 sm:h-8 px-1.5 sm:px-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 hover:text-purple-600 dark:hover:text-purple-300 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center shrink-0"
          aria-label="Next Page"
          title="Next Page"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
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
export class PaginationComponent implements OnChanges {
  @Input() page = 1;
  @Input() limit = 10;
  @Input() totalItems = 0;
  @Input() totalPages = 1;
  @Input() pageSizeOptions = [5, 10, 20, 50];
  @Input() showPageSize = true;

  @Output() pageChange = new EventEmitter<number>();
  @Output() limitChange = new EventEmitter<number>();

  visiblePages: number[] = [];

  ngOnChanges(changes: SimpleChanges) {
    this.calculatePages();
  }

  get startItem(): number {
    if (this.totalItems === 0) return 0;
    return (this.page - 1) * this.limit + 1;
  }

  get endItem(): number {
    return Math.min(this.page * this.limit, this.totalItems);
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages && newPage !== this.page) {
      this.pageChange.emit(newPage);
    }
  }

  onLimitSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const newLimit = Number(select.value);
    if (newLimit) {
      this.limitChange.emit(newLimit);
    }
  }

  private calculatePages() {
    const total = this.totalPages;
    const current = this.page;
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (current > 3) {
        pages.push(-1); // Ellipsis
      }

      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < total - 2) {
        pages.push(-1); // Ellipsis
      }

      pages.push(total);
    }

    this.visiblePages = pages;
  }
}
