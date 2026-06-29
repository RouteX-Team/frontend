import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthStore } from '../../core/auth/auth-store';
import { UserRole } from '../../shared/models/user.model';

interface QuickLink {
  label: string;
  description: string;
  path: string;
  icon: string;
  roles: UserRole[];
}

const QUICK_LINKS: QuickLink[] = [
  { label: 'Browse routes', description: 'Stops, timetables and maps for every route.', path: '/routes', icon: 'alt_route', roles: ['Student', 'Admin'] },
  { label: 'Live map', description: 'Track buses moving in real time.', path: '/track', icon: 'map', roles: ['Student', 'Admin'] },
  { label: 'Favorites', description: 'Your saved routes and proximity alerts.', path: '/favorites', icon: 'star', roles: ['Student'] },
  { label: 'Driver console', description: 'Start a trip and broadcast your location.', path: '/driver', icon: 'directions_bus', roles: ['Driver'] },
  { label: 'Manage routes', description: 'Create and edit routes, stops and schedules.', path: '/admin/routes', icon: 'edit_road', roles: ['Admin'] },
  { label: 'Fleet & users', description: 'Buses, drivers and student accounts.', path: '/admin/buses', icon: 'groups', roles: ['Admin'] },
  { label: 'Announcements', description: 'Publish disruptions and notices.', path: '/admin/announcements', icon: 'campaign', roles: ['Admin'] },
  { label: 'Reports', description: 'Route usage and exports.', path: '/admin/reports', icon: 'insights', roles: ['Admin'] },
];

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatIconModule],
  template: `
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-slate-800 m-0">
        Welcome, {{ auth.displayName() }}
      </h1>
      <p class="text-slate-500 mt-1">
        Signed in as <span class="font-medium text-slate-600">{{ auth.role() }}</span>
      </p>
    </header>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      @for (link of links(); track link.path) {
        <a
          [routerLink]="link.path"
          class="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 hover:ring-sky-300 hover:shadow-md transition no-underline"
        >
          <div class="flex items-center gap-3">
            <span class="grid place-items-center h-11 w-11 rounded-xl bg-sky-50 text-sky-600">
              <mat-icon>{{ link.icon }}</mat-icon>
            </span>
            <h2 class="text-base font-semibold text-slate-800 m-0 group-hover:text-sky-700">
              {{ link.label }}
            </h2>
          </div>
          <p class="text-sm text-slate-500 mt-3 m-0">{{ link.description }}</p>
        </a>
      }
    </div>
  `,
})
export class Dashboard {
  readonly auth = inject(AuthStore);

  readonly links = computed(() => {
    const role = this.auth.role();
    if (!role) return [];
    return QUICK_LINKS.filter((l) => l.roles.includes(role));
  });
}
