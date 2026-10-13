import { Component, Input } from '@angular/core';

export type IconName = 'car' | 'odometer' | 'dashboard';

/** Original line icons (24px grid). Colour follows the text colour. */
@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="w-full h-full"
      [attr.aria-hidden]="label ? null : 'true'"
      [attr.role]="label ? 'img' : null"
      [attr.aria-label]="label"
    >
      @switch (name) {
        @case ('car') {
          <path
            d="M5.1 16.5H3.75A.75.75 0 0 1 3 15.75V13.4a2 2 0 0 1 .42-1.23L5.3 9.2A3 3 0 0 1 7.67 8h6.06a3 3 0 0 1 2.14.9l2.63 2.6 1.87.42A2 2 0 0 1 22 13.87v1.88a.75.75 0 0 1-.75.75H18.9M8.9 16.5h6.2"
          />
          <path d="M5.5 11.6h12.6M11.5 8v3.6" />
          <circle cx="7" cy="16.5" r="1.9" />
          <circle cx="17" cy="16.5" r="1.9" />
        }
        @case ('odometer') {
          <path d="M5.07 18A8 8 0 1 1 18.93 18" />
          <path d="M12 14l3.4-4.4" />
          <path
            d="M12 7.2v1.3M7.2 9.2l.9.9M16.8 9.2l-.9.9M5.2 14h1.3M18.8 14h-1.3"
          />
          <circle cx="12" cy="14" r="1.2" fill="currentColor" />
        }
        @case ('dashboard') {
          <rect x="3.5" y="3.5" width="7" height="8" rx="1.5" />
          <rect x="13.5" y="3.5" width="7" height="5" rx="1.5" />
          <rect x="13.5" y="11.5" width="7" height="9" rx="1.5" />
          <rect x="3.5" y="14.5" width="7" height="6" rx="1.5" />
        }
      }
    </svg>
  `,
  styles: [':host { display: inline-block; flex-shrink: 0; }'],
})
export class IconComponent {
  @Input({ required: true }) name!: IconName;
  /** Accessible name; omit for decorative icons. */
  @Input() label?: string;
}
