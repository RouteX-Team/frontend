/**
 * RouteX - Theme Service
 * Handles light/dark mode toggle with system preference detection
 */

import { Injectable, signal, computed, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private platformId = inject(PLATFORM_ID);
    private isBrowser = isPlatformBrowser(this.platformId);

    private readonly STORAGE_KEY = 'rx-theme';

    // Internal theme state
    private themeSignal = signal<Theme>(this.getInitialTheme());

    // Public readonly signals
    readonly theme = this.themeSignal.asReadonly();
    readonly isDark = computed(() => this.themeSignal() === 'dark');
    readonly isLight = computed(() => this.themeSignal() === 'light');

    constructor() {
        // Apply theme changes to DOM
        effect(() => {
            this.applyTheme(this.themeSignal());
        });

        // Listen for system preference changes
        if (this.isBrowser) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem(this.STORAGE_KEY)) {
                    this.themeSignal.set(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    /**
     * Toggle between light and dark themes
     */
    toggle(): void {
        const newTheme = this.themeSignal() === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    /**
     * Set specific theme
     */
    setTheme(theme: Theme): void {
        this.themeSignal.set(theme);
        if (this.isBrowser) {
            localStorage.setItem(this.STORAGE_KEY, theme);
        }
    }

    /**
     * Get initial theme from storage or system preference
     */
    private getInitialTheme(): Theme {
        if (!this.isBrowser) {
            return 'light';
        }

        const saved = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
        if (saved) {
            return saved;
        }

        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    /**
     * Apply theme to document
     */
    private applyTheme(theme: Theme): void {
        if (!this.isBrowser) return;

        const root = document.documentElement;
        root.setAttribute('data-theme', theme);

        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }
}
