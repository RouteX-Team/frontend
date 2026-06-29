import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface AdminSection {
  label: string;
  description: string;
  path: string;
  icon: string;
}

const SECTIONS: AdminSection[] = [
  { label: 'Routes', description: 'Create routes and order their stops.', path: '/admin/routes', icon: 'alt_route' },
  { label: 'Stops', description: 'Manage stop locations on the map.', path: '/admin/stops', icon: 'location_on' },
  { label: 'Buses', description: 'Fleet, capacity, status and assignments.', path: '/admin/buses', icon: 'directions_bus' },
  { label: 'Users', description: 'Students, drivers and roles.', path: '/admin/users', icon: 'group' },
  { label: 'Announcements', description: 'Publish disruptions and notices.', path: '/admin/announcements', icon: 'campaign' },
  { label: 'Reports', description: 'Route-usage analytics and exports.', path: '/admin/reports', icon: 'insights' },
];

@Component({
  selector: 'app-admin-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatIconModule],
  template: `
    <header class="mb-6 flex items-center gap-3">
      <mat-icon class="text-sky-600">admin_panel_settings</mat-icon>
      <div>
        <h1 class="text-2xl font-bold text-slate-800 m-0">Administration</h1>
        <p class="text-slate-500 m-0 text-sm">Manage the campus transport system.</p>
      </div>
    </header>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      @for (s of sections; track s.path) {
        <a
          [routerLink]="s.path"
          class="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 hover:ring-sky-300 hover:shadow-md transition no-underline"
        >
          <div class="flex items-center gap-3">
            <span class="grid place-items-center h-11 w-11 rounded-xl bg-sky-50 text-sky-600">
              <mat-icon>{{ s.icon }}</mat-icon>
            </span>
            <h2 class="text-base font-semibold text-slate-800 m-0 group-hover:text-sky-700">
              {{ s.label }}
            </h2>
          </div>
          <p class="text-sm text-slate-500 mt-3 m-0">{{ s.description }}</p>
        </a>
      }
    </div>
  `,
})
export class AdminHome {
  readonly sections = SECTIONS;
}
