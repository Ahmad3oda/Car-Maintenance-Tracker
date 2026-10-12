import { Component, Input } from '@angular/core';

/** Loading indicator: a turning wheel. Stops turning under reduced motion. */
@Component({
  selector: 'app-wheel-spinner',
  standalone: true,
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      class="w-full h-full animate-spin [animation-duration:1.1s]"
      role="status"
      [attr.aria-label]="label"
    >
      <circle cx="12" cy="12" r="9" stroke-width="2.2" />
      <circle cx="12" cy="12" r="4.6" stroke-width="1.4" />
      <path
        stroke-width="1.4"
        d="M12 10.8V7.4M13.14 11.63l3.23-1.05M12.7 12.97l2 2.75M11.3 12.97l-2 2.75M10.86 11.63L7.63 10.58"
      />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  `,
  styles: [':host { display: inline-block; flex-shrink: 0; }'],
})
export class WheelSpinnerComponent {
  @Input() label = 'Loading';
}
