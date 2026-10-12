import { Component, Input } from '@angular/core';

export type UrgencyStatus = 'OVERDUE' | 'DUE_SOON' | 'UPCOMING' | 'HEALTHY' | 'OK';

interface Light {
  tone: 'overdue' | 'soon' | 'upcoming' | 'ok';
  label: string;
}

const LIGHTS: Record<string, Light> = {
  OVERDUE: { tone: 'overdue', label: 'Overdue' },
  DUE_SOON: { tone: 'soon', label: 'Due Soon' },
  UPCOMING: { tone: 'upcoming', label: 'Upcoming' },
};
const HEALTHY: Light = { tone: 'ok', label: 'Healthy' };

/**
 * Status styled like a dashboard warning light: a lit lamp with a symbol,
 * plus the label (never colour alone). Colours: status tokens in styles.css.
 */
@Component({
  selector: 'app-urgency-badge',
  standalone: true,
  template: `
    <span [class]="'badge tone-' + light.tone">
      <span class="lamp" aria-hidden="true">
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          @switch (light.tone) {
            @case ('overdue') {
              <path d="M6 2.8v3.6" /><circle cx="6" cy="8.9" r="0.4" fill="currentColor" />
            }
            @case ('soon') {
              <path d="M6 3.2v2.9l1.8 1.1" />
            }
            @case ('upcoming') {
              <path d="M3.5 6h5M6.5 4l2 2-2 2" />
            }
            @default {
              <path d="M3.4 6.2l1.7 1.7 3.5-3.6" />
            }
          }
        </svg>
      </span>
      {{ light.label }}
    </span>
  `,
  styles: [
    `
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.2rem 0.6rem 0.2rem 0.25rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
        line-height: 1rem;
        white-space: nowrap;
        color: rgb(var(--tone-fg));
        background: rgb(var(--tone-bg) / var(--status-bg-alpha));
        border: 1px solid rgb(var(--tone-light) / 0.45);
      }
      .lamp {
        display: inline-flex;
        width: 1.05rem;
        height: 1.05rem;
        padding: 0.15rem;
        border-radius: 9999px;
        color: rgb(var(--white));
        background: rgb(var(--tone-light));
        box-shadow: 0 0 0 2px rgb(var(--tone-light) / 0.2),
          0 0 8px rgb(var(--tone-light) / 0.55);
      }
      .lamp svg {
        width: 100%;
        height: 100%;
      }
      .tone-overdue {
        --tone-fg: var(--status-overdue-fg);
        --tone-bg: var(--status-overdue-bg);
        --tone-light: var(--status-overdue-light);
      }
      .tone-overdue .lamp {
        animation: lamp-glow 2.4s ease-in-out infinite;
      }
      .tone-soon {
        --tone-fg: var(--status-soon-fg);
        --tone-bg: var(--status-soon-bg);
        --tone-light: var(--status-soon-light);
      }
      /* Dark symbol where the lamp is light (amber; all lamps in dark mode). */
      .tone-soon .lamp,
      :host-context(.dark) .lamp {
        color: rgb(var(--neutral-900));
      }
      .tone-upcoming {
        --tone-fg: var(--status-upcoming-fg);
        --tone-bg: var(--status-upcoming-bg);
        --tone-light: var(--status-upcoming-light);
      }
      .tone-ok {
        --tone-fg: var(--status-ok-fg);
        --tone-bg: var(--status-ok-bg);
        --tone-light: var(--status-ok-light);
      }
      @keyframes lamp-glow {
        50% {
          box-shadow: 0 0 0 3px rgb(var(--tone-light) / 0.15),
            0 0 12px rgb(var(--tone-light) / 0.8);
        }
      }
    `,
  ],
})
export class UrgencyBadgeComponent {
  @Input() status: UrgencyStatus | string = 'HEALTHY';

  get light(): Light {
    return LIGHTS[this.status] ?? HEALTHY;
  }
}
