import { Component, Input } from '@angular/core';

/** Licence-plate style badge (generic; no country markings). */
@Component({
  selector: 'app-plate',
  standalone: true,
  template: `
    <span
      class="inline-flex items-center gap-1.5 rounded-md border-2 border-gray-800 bg-white px-1.5 py-px font-mono font-medium uppercase tracking-[0.15em] text-gray-900 shadow-[inset_0_0_0_1px_rgb(var(--white))] dark:border-gray-300 dark:bg-gray-100"
      [class.text-3xs]="size === 'sm'"
      [class.text-xs]="size === 'md'"
      [attr.aria-label]="'Plate ' + number"
    >
      <span class="h-1 w-1 rounded-full bg-gray-400" aria-hidden="true"></span>
      <span>{{ number }}</span>
      <span class="h-1 w-1 rounded-full bg-gray-400" aria-hidden="true"></span>
    </span>
  `,
  styles: [':host { display: inline-flex; max-width: 100%; }'],
})
export class PlateComponent {
  @Input({ required: true }) number!: string;
  @Input() size: 'sm' | 'md' = 'md';
}
