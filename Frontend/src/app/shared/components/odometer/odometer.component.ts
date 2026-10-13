import { AfterViewInit, Component, Input } from '@angular/core';

interface OdometerChar {
  digit: number | null;
  text: string;
}

/**
 * Shows a value (number or formatted text like "1,250.00 £") with its
 * digits rolling up from 0 like an odometer when it first appears, and
 * rolling to new digits when the value changes.
 */
@Component({
  selector: 'app-odometer',
  standalone: true,
  template: `
    <span class="sr-only">{{ text }}</span>
    <span class="odo" aria-hidden="true">
      @for (char of chars; track $index) {
        @if (char.digit === null) {
          <span>{{ char.text }}</span>
        } @else {
          <span class="odo-digit">
            <span
              class="odo-strip"
              [style.transform]="'translateY(-' + (ready ? char.digit : 0) * 10 + '%)'"
              [style.transition-delay]="$index * 40 + 'ms'"
            >
              @for (n of digits; track n) {
                <span>{{ n }}</span>
              }
            </span>
          </span>
        }
      }
    </span>
  `,
  styles: [
    `
      .odo {
        display: inline-flex;
        font-variant-numeric: tabular-nums;
      }
      .odo-digit {
        display: inline-block;
        height: 1.25em;
        line-height: 1.25em;
        overflow: hidden;
      }
      .odo-strip {
        display: flex;
        flex-direction: column;
        transition: transform 900ms cubic-bezier(0.16, 1, 0.3, 1);
      }
    `,
  ],
})
export class OdometerComponent implements AfterViewInit {
  readonly digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  text = '';
  chars: OdometerChar[] = [];
  /** Digits start at 0 and roll to their value after the first render. */
  ready = false;

  @Input({ required: true }) set value(value: string | number | null) {
    this.text = value === null ? '' : String(value);
    this.chars = [...this.text].map((text) => ({
      digit: /\d/.test(text) ? Number(text) : null,
      text,
    }));
  }

  ngAfterViewInit(): void {
    // Next frame, so the browser paints the 0 position first.
    requestAnimationFrame(() => (this.ready = true));
  }
}
