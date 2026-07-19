import { Component } from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: true,
  template: `
    <div class="w-full overflow-hidden rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
      <div class="w-full overflow-x-auto">
        <table class="w-full whitespace-nowrap">
          <thead class="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10 text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 dark:text-gray-400">
            <ng-content select="[thead]"></ng-content>
          </thead>
          <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            <ng-content select="[tbody]"></ng-content>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class TableComponent {}
