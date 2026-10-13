import { Injectable, signal } from '@angular/core';

type Theme = 'light' | 'dark';

/** Keep in sync with the inline script in index.html (prevents a flash). */
const THEME_KEY = 'car_tracker_theme';
const SWITCH_MS = 300;

/**
 * Follows the system setting until the user picks a theme with the header
 * toggle; that choice is then remembered.
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly isDark = signal<boolean>(false);

  private readonly systemDark = window.matchMedia?.(
    '(prefers-color-scheme: dark)',
  );
  private switchTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.apply(this.savedTheme() ?? this.systemTheme());
    // Track system changes while the user has not chosen.
    this.systemDark?.addEventListener('change', () => {
      if (!this.savedTheme()) this.animate(() => this.apply(this.systemTheme()));
    });
  }

  toggleTheme(): void {
    const next: Theme = this.isDark() ? 'light' : 'dark';
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage unavailable: the choice lasts until the page is closed.
    }
    this.animate(() => this.apply(next));
  }

  private apply(theme: Theme): void {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.setAttribute('data-theme', theme);
    this.isDark.set(theme === 'dark');
  }

  /** Cross-fades colours for this one switch (see .theme-switching). */
  private animate(change: () => void): void {
    const root = document.documentElement;
    clearTimeout(this.switchTimer);
    root.classList.add('theme-switching');
    change();
    this.switchTimer = setTimeout(
      () => root.classList.remove('theme-switching'),
      SWITCH_MS,
    );
  }

  private savedTheme(): Theme | null {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      return saved === 'light' || saved === 'dark' ? saved : null;
    } catch {
      return null;
    }
  }

  private systemTheme(): Theme {
    return this.systemDark?.matches ? 'dark' : 'light';
  }
}
