import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

export type RouteXRole = 'admin' | 'student' | 'parent' | 'driver';

export interface RouteXUser {
  name: string;
  email: string;
  role: RouteXRole;
}

const STORAGE_KEY = 'routex-session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly browser = isPlatformBrowser(this.platformId);
  readonly user = signal<RouteXUser | null>(this.readSession());

  login(email: string, role: RouteXRole): void {
    const names: Record<RouteXRole, string> = {
      admin: 'Elena Marquez',
      student: 'Amelia Tran',
      parent: 'Hung Tran',
      driver: 'Maya Okafor',
    };
    const user = { email, role, name: names[role] };
    this.user.set(user);
    if (this.browser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  }

  logout(): void {
    this.user.set(null);
    if (this.browser) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  private readSession(): RouteXUser | null {
    if (!this.browser) {
      return null;
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as RouteXUser;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }
}
