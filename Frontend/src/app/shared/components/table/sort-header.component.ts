import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sort-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      (click)="toggleSort()"
      class="inline-flex items-center gap-1.5 font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 focus:outline-none transition-colors group cursor-pointer select-none"
      [class.text-purple-600]="isActive"
      [class.dark:text-purple-400]="isActive"
      [attr.aria-sort]="ariaSort"
    >
      <span><ng-content></ng-content></span>

      <!-- Direction Indicator Arrow -->
      <span class="inline-flex items-center justify-center w-4 h-4 rounded-md transition-all">
        <!-- Active Ascending Arrow -->
        <svg
          *ngIf="isActive && currentOrder === 'ASC'"
          class="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-in fade-in"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7" />
        </svg>

        <!-- Active Descending Arrow -->
        <svg
          *ngIf="isActive && currentOrder === 'DESC'"
          class="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-in fade-in"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
        </svg>

        <!-- Inactive Dual Sort Arrow -->
        <svg
          *ngIf="!isActive"
          class="w-3 h-3 text-gray-400 dark:text-gray-500 opacity-40 group-hover:opacity-100 group-hover:text-purple-500 transition-opacity"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      </span>
    </button>
  `,
})
export class SortHeaderComponent {
  @Input({ required: true }) field!: string;
  @Input() currentSortBy = '';
  @Input() currentOrder: 'ASC' | 'DESC' = 'DESC';

  @Output() sortChange = new EventEmitter<{ sortBy: string; order: 'ASC' | 'DESC' }>();

  get isActive(): boolean {
    return this.currentSortBy === this.field;
  }

  get ariaSort(): 'ascending' | 'descending' | 'none' {
    if (!this.isActive) return 'none';
    return this.currentOrder === 'ASC' ? 'ascending' : 'descending';
  }

  toggleSort() {
    if (this.isActive) {
      const nextOrder = this.currentOrder === 'ASC' ? 'DESC' : 'ASC';
      this.sortChange.emit({ sortBy: this.field, order: nextOrder });
    } else {
      this.sortChange.emit({ sortBy: this.field, order: 'DESC' });
    }
  }
}
