import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';

export type RouteXTheme = 'light' | 'dark';
export type RouteXDensity = 'comfortable' | 'compact';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly browser = isPlatformBrowser(this.platformId);
  readonly theme = signal<RouteXTheme>(this.read<'light' | 'dark'>('routex-theme', 'light'));
  readonly density = signal<RouteXDensity>(this.read<'comfortable' | 'compact'>('routex-density', 'comfortable'));

  constructor() {
    effect(() => {
      const theme = this.theme();
      const density = this.density();
      this.document.documentElement.setAttribute('data-theme', theme);
      this.document.documentElement.setAttribute('data-density', density);
      if (this.browser) {
        localStorage.setItem('routex-theme', theme);
        localStorage.setItem('routex-density', density);
      }
    });
  }

  toggleTheme(): void {
    this.theme.update((theme) => (theme === 'dark' ? 'light' : 'dark'));
  }

  toggleDensity(): void {
    this.density.update((density) => (density === 'compact' ? 'comfortable' : 'compact'));
  }

  private read<T extends string>(key: string, fallback: T): T {
    if (!this.browser) {
      return fallback;
    }

    return (localStorage.getItem(key) as T | null) ?? fallback;
  }
}
