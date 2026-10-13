import { Component } from '@angular/core';

/** Placeholder for a detail page (photo card + table) while it loads. */
@Component({
  selector: 'app-detail-skeleton',
  standalone: true,
  template: `
    <div
      class="appear-delayed w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto min-w-0"
      role="status"
      aria-label="Loading"
    >
      <div class="skeleton h-7 w-48 my-5 sm:my-7"></div>
      <div
        class="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6 mb-6 sm:mb-8 bg-white rounded-2xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="skeleton w-full sm:w-48 md:w-56 h-40 sm:h-36 md:h-40 rounded-xl shrink-0"></div>
        <div class="flex-1 space-y-3 py-1">
          <div class="skeleton h-6 w-1/2"></div>
          <div class="skeleton h-4 w-1/3"></div>
          <div class="skeleton h-4 w-1/4"></div>
        </div>
      </div>
      <div class="p-4 space-y-4 bg-white rounded-2xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
        @for (row of rows; track row) {
          <div class="flex items-center gap-4">
            <div class="skeleton h-9 w-9 shrink-0"></div>
            <div class="skeleton h-3 flex-1"></div>
            <div class="skeleton h-3 w-1/5"></div>
          </div>
        }
      </div>
    </div>
  `,
})
export class DetailSkeletonComponent {
  readonly rows = [1, 2, 3];
}
