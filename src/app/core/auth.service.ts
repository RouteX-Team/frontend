import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

export type RouteXRole = 'admin' | 'student' | 'parent' | 'driver';

export interface RouteXUser {
  name: string;
  email: string;
  role: RouteXRole;
}

const STORAGE_KEY = 'routex-session';
const VALID_ROLES: RouteXRole[] = ['admin', 'student', 'parent', 'driver'];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly browser = isPlatformBrowser(this.platformId);
  readonly user = signal<RouteXUser | null>(null);

  constructor() {
    this.user.set(this.readSession());
  }

  login(email: string, role: RouteXRole): void {
    const names: Record<RouteXRole, string> = {
      admin: 'Elena Marquez',
      student: 'Amelia Tran',
      parent: 'Hung Tran',
      driver: 'Maya Okafor',
    };
    const user = { email, role, name: names[role] };
    this.user.set(user);
    if (this.canUseStorage()) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } catch {
        // Storage can be unavailable in strict browser/privacy modes.
      }
    }
  }

  logout(): void {
    this.user.set(null);
    if (this.canUseStorage()) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore storage failures; the in-memory session is already cleared.
      }
    }
  }

  private readSession(): RouteXUser | null {
    if (!this.canUseStorage()) {
      return null;
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    try {
      const parsed: unknown = JSON.parse(raw);
      if (this.isRouteXUser(parsed)) {
        return parsed;
      }

      localStorage.removeItem(STORAGE_KEY);
      return null;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  private canUseStorage(): boolean {
    return this.browser && typeof localStorage !== 'undefined';
  }

  private isRouteXUser(value: unknown): value is RouteXUser {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const user = value as Partial<RouteXUser>;
    return (
      typeof user.name === 'string' &&
      typeof user.email === 'string' &&
      typeof user.role === 'string' &&
      VALID_ROLES.includes(user.role as RouteXRole)
    );
  }
}
