import { Component, Input } from '@angular/core';

const DAYS_PER_MONTH = 30.44;

type GaugeStatus = 'OVERDUE' | 'DUE_SOON' | 'UPCOMING' | 'OK';

/**
 * Fuel-gauge style bar: full right after a service, empty when it is due.
 * Uses whichever of distance or time is closer to due.
 */
@Component({
  selector: 'app-service-gauge',
  standalone: true,
  template: `
    @if (fraction !== null) {
      <span
        class="inline-flex items-center gap-1.5 align-middle"
        role="meter"
        aria-label="Service interval remaining"
        aria-valuemin="0"
        aria-valuemax="100"
        [attr.aria-valuenow]="percent"
        [attr.aria-valuetext]="percent + '% of the service interval left'"
        [title]="percent + '% of the service interval left'"
      >
        <span class="text-3xs font-bold text-gray-400 dark:text-gray-500" aria-hidden="true">E</span>
        <span class="gauge" aria-hidden="true">
          <span
            class="gauge-fill"
            [style.width.%]="percent"
            [style.background-color]="'rgb(var(--status-' + tone + '-light))'"
          ></span>
        </span>
        <span class="text-3xs font-bold text-gray-400 dark:text-gray-500" aria-hidden="true">F</span>
      </span>
    }
  `,
  styles: [
    `
      .gauge {
        position: relative;
        display: inline-block;
        width: 4.5rem;
        height: 0.4rem;
        border-radius: 9999px;
        overflow: hidden;
        background:
          /* quarter tick marks, like a fuel gauge */
          linear-gradient(90deg, transparent 24.5%, rgb(var(--surface)) 24.5% 25.5%, transparent 25.5% 49.5%, rgb(var(--surface)) 49.5% 50.5%, transparent 50.5% 74.5%, rgb(var(--surface)) 74.5% 75.5%, transparent 75.5%),
          rgb(var(--text-muted) / 0.25);
      }
      .gauge-fill {
        position: absolute;
        inset: 0 auto 0 0;
        border-radius: inherit;
        animation: gauge-fill 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
      }
      @keyframes gauge-fill {
        from {
          width: 0;
        }
      }
    `,
  ],
})
export class ServiceGaugeComponent {
  @Input() remainingKm?: number | null;
  @Input() intervalKm?: number | null;
  @Input() remainingDays?: number | null;
  @Input() intervalMonths?: number | null;
  /** API status; picks the colour so the gauge agrees with the badge. */
  @Input() status?: string | null;

  /** 0 (due) .. 1 (just serviced); null when there is no interval. */
  get fraction(): number | null {
    const parts: number[] = [];
    if (this.intervalKm && this.remainingKm != null) {
      parts.push(this.remainingKm / this.intervalKm);
    }
    if (this.intervalMonths && this.remainingDays != null) {
      parts.push(this.remainingDays / (this.intervalMonths * DAYS_PER_MONTH));
    }
    return parts.length ? Math.min(1, Math.max(0, Math.min(...parts))) : null;
  }

  get percent(): number {
    return Math.round((this.fraction ?? 0) * 100);
  }

  get tone(): 'overdue' | 'soon' | 'upcoming' | 'ok' {
    const byStatus: Record<GaugeStatus, 'overdue' | 'soon' | 'upcoming' | 'ok'> = {
      OVERDUE: 'overdue',
      DUE_SOON: 'soon',
      UPCOMING: 'upcoming',
      OK: 'ok',
    };
    const known = this.status && byStatus[this.status as GaugeStatus];
    if (known) return known;
    const f = this.fraction ?? 1;
    return f <= 0 ? 'overdue' : f < 0.2 ? 'soon' : f < 0.4 ? 'upcoming' : 'ok';
  }
}
