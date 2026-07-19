import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
      <div [ngClass]="iconContainerClass" class="p-4 mr-4 rounded-full">
        <ng-content select="[icon]"></ng-content>
      </div>
      <div>
        <p class="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-800 dark:text-gray-200">{{ value }}</p>
      </div>
    </div>
  `
})
export class StatCardComponent {
  @Input() title!: string;
  @Input() value!: string | number;
  @Input() color: 'orange' | 'green' | 'blue' | 'teal' | 'purple' = 'purple';

  get iconContainerClass(): string {
    const colors = {
      orange: 'text-orange-500 bg-orange-100 dark:text-orange-100 dark:bg-orange-500',
      green: 'text-green-500 bg-green-100 dark:text-green-100 dark:bg-green-500',
      blue: 'text-blue-500 bg-blue-100 dark:text-blue-100 dark:bg-blue-500',
      teal: 'text-teal-500 bg-teal-100 dark:text-teal-100 dark:bg-teal-500',
      purple: 'text-purple-600 bg-purple-100 dark:text-purple-100 dark:bg-purple-600'
    };
    return colors[this.color];
  }
}
