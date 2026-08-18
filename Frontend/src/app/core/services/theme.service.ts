import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'car_tracker_theme';
  readonly isDark = signal<boolean>(false);

  constructor() {
    this.initTheme();
  }

  private initTheme() {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme) {
      this.setDark(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setDark(prefersDark);
    }
  }

  toggleTheme() {
    this.setDark(!this.isDark());
  }

  setDark(isDark: boolean) {
    this.isDark.set(isDark);
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem(this.THEME_KEY, 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      localStorage.setItem(this.THEME_KEY, 'light');
    }
  }
}
