import { Component } from '@angular/core';

/**
 * Decorative scene for the auth pages: a car driving past a skyline.
 * Original inline SVG; only transforms are animated (cheap to paint),
 * and the global reduced-motion rule in styles.css stops all of it.
 */
@Component({
  selector: 'app-road-scene',
  standalone: true,
  template: `
    <svg viewBox="0 0 480 220" class="w-full h-auto" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient [attr.id]="uid + '-beam'" x1="0" x2="1">
          <stop offset="0" stop-color="rgb(var(--amber-100))" stop-opacity="0.55" />
          <stop offset="1" stop-color="rgb(var(--amber-100))" stop-opacity="0" />
        </linearGradient>
        <linearGradient [attr.id]="uid + '-body'" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="rgb(var(--white))" />
          <stop offset="1" stop-color="rgb(var(--brand-100))" />
        </linearGradient>
      </defs>

      <!-- Far hills and near skyline: two copies side by side, slid left by one copy. -->
      <g class="rs-loop rs-far">
        <path [attr.id]="uid + '-hills'" d="M0 150Q60 112 120 138T240 132T360 140T480 150V186H0Z" />
        <use [attr.href]="'#' + uid + '-hills'" x="480" />
      </g>
      <g class="rs-loop rs-near">
        <path
          [attr.id]="uid + '-city'"
          d="M0 186V158H18V142H40V160H56V128H74V112H86V128H100V150H124V136H146V164H160V122H184V146H204V158H226V132H240V118H256V132H268V156H292V140H316V160H330V126H352V150H372V138H396V162H414V130H432V146H456V156H480V186Z"
        />
        <use [attr.href]="'#' + uid + '-city'" x="480" />
      </g>

      <!-- Road with moving centre line. -->
      <rect y="186" width="480" height="34" class="rs-road" />
      <path d="M0 203H960" class="rs-dash" />

      <!-- Car: bobs gently while the wheels turn. -->
      <g transform="translate(128 118)">
        <path d="M211 44L340 18V72Z" [attr.fill]="'url(#' + uid + '-beam)'" class="rs-beam" />
        <g class="rs-speed">
          <path d="M-46 30H-8M-62 42H-18M-38 54H-4" />
        </g>
        <g class="rs-body">
          <path
            d="M14 60L10 46Q10 40 18 38L52 34Q68 17 94 14H138Q158 16 174 31L200 37Q212 40 213 50L212 60Z"
            [attr.fill]="'url(#' + uid + '-body)'"
          />
          <path d="M66 34Q80 21 98 19H118V34Z M124 19H138Q152 21 163 34H124Z" class="rs-glass" />
          <path d="M121 37V58M100 42H110M142 42H152" class="rs-line" />
          <rect x="203" y="41" width="9" height="5" rx="2.5" class="rs-head" />
          <rect x="10" y="42" width="6" height="5" rx="2" class="rs-tail" />
        </g>
        @for (x of wheels; track x) {
          <g [attr.transform]="'translate(' + x + ' 60)'">
            <circle r="15" class="rs-tyre" />
            <g class="rs-spin">
              <circle r="9" class="rs-rim" />
              <path d="M0-9V9M-9 0H9M-6.4-6.4L6.4 6.4M-6.4 6.4L6.4-6.4" class="rs-spoke" />
              <circle r="2.5" class="rs-hub" />
            </g>
          </g>
        }
      </g>
    </svg>
  `,
  styles: `
    :host { display: block; }
    .rs-far { fill: rgb(var(--white) / 0.08); animation-duration: 36s; }
    .rs-near { fill: rgb(var(--white) / 0.14); animation-duration: 18s; }
    .rs-loop { animation-name: rs-slide; animation-timing-function: linear; animation-iteration-count: infinite; }
    .rs-road { fill: rgb(var(--black) / 0.28); }
    .rs-dash { stroke: rgb(var(--white) / 0.5); stroke-width: 3; stroke-dasharray: 22 26; animation: rs-dash 0.5s linear infinite; }
    .rs-body { animation: rs-bob 0.9s ease-in-out infinite alternate; }
    .rs-glass { fill: rgb(var(--brand-800)); }
    .rs-line { stroke: rgb(var(--brand-300)); stroke-width: 1.5; stroke-linecap: round; fill: none; }
    .rs-head { fill: rgb(var(--amber-200)); }
    .rs-tail { fill: rgb(var(--red-500)); }
    .rs-beam { animation: rs-flicker 3s ease-in-out infinite alternate; }
    .rs-speed { stroke: rgb(var(--white) / 0.55); stroke-width: 2.5; stroke-linecap: round; animation: rs-speed 0.8s ease-out infinite; }
    .rs-tyre { fill: rgb(var(--neutral-900)); }
    .rs-rim { fill: rgb(var(--neutral-300)); }
    .rs-spoke { stroke: rgb(var(--neutral-600)); stroke-width: 1.6; }
    .rs-hub { fill: rgb(var(--neutral-700)); }
    .rs-spin { transform-box: fill-box; transform-origin: center; animation: rs-spin 0.45s linear infinite; }
    @keyframes rs-slide { to { transform: translateX(-480px); } }
    @keyframes rs-dash { to { transform: translateX(-48px); } }
    @keyframes rs-bob { to { transform: translateY(-1.5px); } }
    @keyframes rs-spin { to { transform: rotate(360deg); } }
    @keyframes rs-flicker { to { opacity: 0.7; } }
    @keyframes rs-speed {
      from { transform: translateX(10px); opacity: 0; }
      40% { opacity: 1; }
      to { transform: translateX(-24px); opacity: 0; }
    }
  `,
})
export class RoadSceneComponent {
  private static nextId = 0;
  // Login shows two scenes (panel and mobile banner): ids must not clash.
  readonly uid = `rs${RoadSceneComponent.nextId++}`;
  readonly wheels = [52, 172];
}
