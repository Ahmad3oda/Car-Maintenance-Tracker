import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col md:flex-row md:items-center justify-between my-6 space-y-4 md:space-y-0">
      <div class="flex items-center space-x-4">
        <ng-content select="[backButton]"></ng-content>
        <div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">{{ title }}</h2>
          <p *ngIf="subtitle" class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ subtitle }}</p>
        </div>
      </div>
      <div>
        <ng-content select="[actions]"></ng-content>
      </div>
    </div>
  `
})
export class PageHeaderComponent {
  @Input() title!: string;
  @Input() subtitle?: string;
}
