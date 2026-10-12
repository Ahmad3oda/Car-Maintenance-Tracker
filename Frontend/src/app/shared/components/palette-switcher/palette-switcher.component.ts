// TEMP-PALETTE: temporary palette preview. Delete this folder and the
// @defer block in app.component.html once a palette is chosen.
import { Component, ViewEncapsulation } from '@angular/core';

interface PaletteOption {
  id: string;
  label: string;
  swatch: string;
}

const STORAGE_KEY = 'cmt.palette-preview';

@Component({
  selector: 'app-palette-switcher',
  standalone: true,
  // Unencapsulated so the palette rules below apply to the whole page.
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      html[data-palette='midnight'] {
        --brand-50: 238 242 255;
        --brand-100: 224 231 255;
        --brand-200: 199 210 254;
        --brand-300: 165 180 252;
        --brand-400: 129 140 248;
        --brand-500: 99 102 241;
        --brand-600: 79 70 229;
        --brand-700: 67 56 202;
        --brand-800: 55 48 163;
        --brand-900: 46 42 120;
        --neutral-50: 247 249 252;
        --neutral-100: 238 242 247;
        --neutral-200: 225 231 239;
        --neutral-300: 203 213 225;
        --neutral-400: 148 163 184;
        --neutral-500: 100 116 139;
        --neutral-600: 71 85 105;
        --neutral-700: 31 41 55;
        --neutral-800: 22 30 44;
        --neutral-900: 13 19 32;
      }
      html[data-palette='petrol'] {
        --brand-50: 239 252 252;
        --brand-100: 211 244 245;
        --brand-200: 168 231 234;
        --brand-300: 111 209 215;
        --brand-400: 47 179 189;
        --brand-500: 15 147 158;
        --brand-600: 13 118 128;
        --brand-700: 15 95 104;
        --brand-800: 18 77 85;
        --brand-900: 18 63 71;
        --neutral-50: 248 249 250;
        --neutral-100: 241 243 244;
        --neutral-200: 227 230 232;
        --neutral-300: 207 212 215;
        --neutral-400: 154 161 166;
        --neutral-500: 107 115 120;
        --neutral-600: 74 82 87;
        --neutral-700: 35 40 44;
        --neutral-800: 25 29 32;
        --neutral-900: 16 19 21;
      }
    `,
  ],
  template: `
    <div
      class="fixed bottom-4 left-4 z-[1000] flex items-center gap-1 rounded-full border border-gray-200 bg-white/95 p-1 pl-3 text-xs shadow-lg dark:border-gray-700 dark:bg-gray-800/95"
      role="radiogroup"
      aria-label="Preview colour palette (temporary)"
    >
      <span class="mr-1 font-semibold text-gray-600 dark:text-gray-300">Palette</span>
      @for (option of options; track option.id) {
        <button
          type="button"
          role="radio"
          [attr.aria-label]="option.label"
          [title]="option.label"
          [attr.aria-checked]="current === option.id"
          (click)="apply(option.id)"
          class="flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium transition-colors"
          [class]="current === option.id ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'"
        >
          <span class="h-3 w-3 rounded-full ring-1 ring-white/60" [style.background]="option.swatch"></span>
          <span class="hidden sm:inline">{{ option.label }}</span>
        </button>
      }
    </div>
  `,
})
export class PaletteSwitcherComponent {
  readonly options: PaletteOption[] = [
    { id: 'violet', label: 'Violet (current)', swatch: '#7e3af2' },
    { id: 'midnight', label: 'Midnight Indigo', swatch: '#4f46e5' },
    { id: 'petrol', label: 'Petrol & Graphite', swatch: '#0d7680' },
  ];
  current = 'violet';

  constructor() {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      // Storage unavailable; preview resets on reload.
    }
    this.apply(this.options.some((o) => o.id === saved) ? saved! : 'violet');
  }

  apply(id: string): void {
    this.current = id;
    document.documentElement.setAttribute('data-palette', id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Ignore.
    }
  }
}
