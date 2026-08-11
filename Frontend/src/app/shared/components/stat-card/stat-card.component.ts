import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center p-5 h-full min-h-[105px] bg-white rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700/70 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200">
      <div [ngClass]="iconContainerClass" class="p-3 mr-4 rounded-xl flex-shrink-0 flex items-center justify-center">
        <ng-content select="[icon]"></ng-content>
      </div>
      <div class="flex-1 min-w-0 flex flex-col justify-center">
        <p class="mb-0.5 text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wide truncate" [title]="title">
          {{ title }}
        </p>
        <p class="text-2xl font-semibold text-gray-800 dark:text-gray-100 tracking-tight truncate">
          {{ value }}
        </p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class StatCardComponent {
  @Input() title!: string;
  @Input() value!: string | number;
  @Input() color: 'orange' | 'green' | 'blue' | 'teal' | 'purple' = 'purple';

  get iconContainerClass(): string {
    const colors = {
      orange: 'text-orange-500 bg-orange-50 dark:text-orange-300 dark:bg-orange-900/30 border border-orange-200/60 dark:border-orange-800/40',
      green: 'text-green-500 bg-green-50 dark:text-green-300 dark:bg-green-900/30 border border-green-200/60 dark:border-green-800/40',
      blue: 'text-blue-500 bg-blue-50 dark:text-blue-300 dark:bg-blue-900/30 border border-blue-200/60 dark:border-blue-800/40',
      teal: 'text-teal-500 bg-teal-50 dark:text-teal-300 dark:bg-teal-900/30 border border-teal-200/60 dark:border-teal-800/40',
      purple: 'text-purple-600 bg-purple-50 dark:text-purple-300 dark:bg-purple-900/30 border border-purple-200/60 dark:border-purple-800/40'
    };
    return colors[this.color];
  }
}
