import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthStore } from '../../core/auth/auth-store';
import { NotificationStore } from '../../core/notifications/notification-store';
import { UserRole } from '../models/user.model';

interface NavLink {
  label: string;
  path: string;
  icon: string;
  roles: UserRole[];
}

const NAV_LINKS: NavLink[] = [
  { label: 'Dashboard', path: '/dashboard', icon: 'dashboard', roles: ['Student', 'Driver', 'Admin'] },
  { label: 'Routes', path: '/routes', icon: 'alt_route', roles: ['Student', 'Admin'] },
  { label: 'Live Map', path: '/track', icon: 'map', roles: ['Student', 'Admin'] },
  { label: 'Favorites', path: '/favorites', icon: 'star', roles: ['Student'] },
  { label: 'Notifications', path: '/notifications', icon: 'notifications', roles: ['Student'] },
  { label: 'Driver', path: '/driver', icon: 'directions_bus', roles: ['Driver'] },
  { label: 'Admin', path: '/admin', icon: 'admin_panel_settings', roles: ['Admin'] },
];

@Component({
  selector: 'app-main-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
  ],
  template: `
    <div class="flex min-h-screen flex-col">
      <mat-toolbar class="bg-white! text-slate-800! shadow-sm ring-1 ring-black/5 gap-2">
        <a routerLink="/dashboard" class="flex items-center gap-2 font-bold text-lg no-underline">
          <mat-icon class="text-sky-600">directions_bus</mat-icon>
          <span>RouteX</span>
        </a>

        <nav class="ml-6 hidden md:flex items-center gap-1">
          @for (link of visibleLinks(); track link.path) {
            <a
              mat-button
              [routerLink]="link.path"
              routerLinkActive="text-sky-600! bg-sky-50!"
              class="text-slate-600!"
            >
              <mat-icon>{{ link.icon }}</mat-icon>
              {{ link.label }}
            </a>
          }
        </nav>

        <span class="flex-1"></span>

        @if (showBell()) {
          <a
            mat-icon-button
            routerLink="/notifications"
            aria-label="Notifications"
            [matBadge]="notifications.unreadCount()"
            [matBadgeHidden]="notifications.unreadCount() === 0"
            matBadgeColor="warn"
            matBadgeSize="small"
          >
            <mat-icon>notifications</mat-icon>
          </a>
        }

        <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Account">
          <mat-icon>account_circle</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <div class="px-4 py-2">
            <p class="font-medium text-slate-800 m-0">{{ auth.displayName() }}</p>
            <p class="text-xs text-slate-500 m-0">{{ auth.role() }}</p>
          </div>
          <!-- Mobile nav links -->
          <div class="md:hidden border-t border-slate-100">
            @for (link of visibleLinks(); track link.path) {
              <a mat-menu-item [routerLink]="link.path">
                <mat-icon>{{ link.icon }}</mat-icon>
                <span>{{ link.label }}</span>
              </a>
            }
          </div>
          <button mat-menu-item (click)="signOut()">
            <mat-icon>logout</mat-icon>
            <span>Sign out</span>
          </button>
        </mat-menu>
      </mat-toolbar>

      <main class="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6">
        <router-outlet />
      </main>
    </div>
  `,
})
export class MainLayout {
  readonly auth = inject(AuthStore);
  readonly notifications = inject(NotificationStore);
  private readonly router = inject(Router);

  readonly visibleLinks = computed(() => {
    const role = this.auth.role();
    if (!role) return [];
    return NAV_LINKS.filter((l) => l.roles.includes(role));
  });

  // Students receive proximity + announcement notifications.
  readonly showBell = computed(() => this.auth.role() === 'Student');

  constructor() {
    if (this.auth.isAuthenticated()) {
      void this.notifications.load();
    }
  }

  signOut(): void {
    this.notifications.clear();
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}
