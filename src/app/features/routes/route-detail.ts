import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RoutesApi } from '../../core/api/routes-api';
import { FavoritesApi } from '../../core/api/favorites-api';
import { AuthStore } from '../../core/auth/auth-store';
import { RouteDetail, Schedule } from '../../shared/models/route.model';
import { RouteMap } from '../../shared/ui/route-map';

@Component({
  selector: 'app-route-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatButtonModule, MatIconModule, RouteMap],
  template: `
    <a routerLink="/routes" class="inline-flex items-center gap-1 text-sky-600 hover:underline mb-4">
      <mat-icon>arrow_back</mat-icon> All routes
    </a>

    @if (loading()) {
      <p class="text-slate-500">Loading route…</p>
    } @else if (error()) {
      <p class="text-rose-600">{{ error() }}</p>
    } @else if (route(); as r) {
      <header class="flex items-center gap-3 mb-4">
        <span class="grid place-items-center h-12 w-12 rounded-xl bg-sky-600 text-white font-bold text-lg">
          {{ r.number }}
        </span>
        <div>
          <h1 class="text-2xl font-bold text-slate-800 m-0">{{ r.name }}</h1>
          @if (r.description) {
            <p class="text-slate-500 m-0 text-sm">{{ r.description }}</p>
          }
        </div>
        @if (auth.isStudent()) {
          <button
            mat-stroked-button
            type="button"
            class="ml-auto"
            [disabled]="favoriteBusy()"
            (click)="toggleFavorite(r.id)"
          >
            <mat-icon [class.text-amber-500]="isFavorite()">
              {{ isFavorite() ? 'star' : 'star_border' }}
            </mat-icon>
            {{ isFavorite() ? 'Favorited' : 'Favorite' }}
          </button>
        }
      </header>

      <div class="grid gap-6 lg:grid-cols-5">
        <div class="lg:col-span-3 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-black/5">
          <div class="h-[420px]">
            <app-route-map [stops]="r.stops" />
          </div>
        </div>

        <div class="lg:col-span-2 space-y-6">
          <section class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 class="text-base font-semibold text-slate-800 mt-0 mb-3">Stops ({{ r.stops.length }})</h2>
            <ol class="relative ml-2">
              @for (stop of r.stops; track stop.id) {
                <li class="flex items-start gap-3 pb-3 last:pb-0">
                  <span class="mt-1 grid place-items-center h-6 w-6 shrink-0 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">
                    {{ stop.sequence }}
                  </span>
                  <span class="text-sm text-slate-700">{{ stop.stopName }}</span>
                </li>
              }
            </ol>
          </section>

          <section class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 class="text-base font-semibold text-slate-800 mt-0 mb-3">Timetable</h2>
            @if (schedules().length === 0) {
              <p class="text-sm text-slate-500 m-0">No schedules published.</p>
            } @else {
              <ul class="divide-y divide-slate-100">
                @for (s of schedules(); track s.id) {
                  <li class="py-2 flex items-center justify-between text-sm">
                    <span class="font-medium text-slate-700">
                      {{ s.departureTime }} → {{ s.arrivalTime }}
                    </span>
                    <span class="text-xs text-slate-500">{{ s.daysOfWeek }}</span>
                  </li>
                }
              </ul>
            }
          </section>
        </div>
      </div>
    }
  `,
})
export class RouteDetailComponent {
  private readonly api = inject(RoutesApi);
  private readonly favoritesApi = inject(FavoritesApi);
  readonly auth = inject(AuthStore);

  readonly id = input.required<string>();
  readonly routeId = computed(() => Number(this.id()));

  readonly route = signal<RouteDetail | null>(null);
  readonly schedules = signal<Schedule[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly isFavorite = signal(false);
  readonly favoriteBusy = signal(false);

  constructor() {
    effect(() => {
      const id = this.routeId();
      if (!Number.isFinite(id)) return;
      this.fetch(id);
      if (this.auth.isStudent()) this.loadFavorite(id);
    });
  }

  private loadFavorite(id: number): void {
    this.favoritesApi.list().subscribe({
      next: (favorites) => this.isFavorite.set(favorites.some((f) => f.routeId === id)),
      error: () => this.isFavorite.set(false),
    });
  }

  toggleFavorite(id: number): void {
    this.favoriteBusy.set(true);
    const done = () => {
      this.isFavorite.update((v) => !v);
      this.favoriteBusy.set(false);
    };
    const fail = () => this.favoriteBusy.set(false);
    if (this.isFavorite()) {
      this.favoritesApi.remove(id).subscribe({ next: done, error: fail });
    } else {
      this.favoritesApi.add(id).subscribe({ next: done, error: fail });
    }
  }

  private fetch(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.getById(id).subscribe({
      next: (route) => {
        this.route.set(route);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Route not found.');
        this.loading.set(false);
      },
    });
    this.api.getSchedules(id).subscribe({
      next: (schedules) => this.schedules.set(schedules),
      error: () => this.schedules.set([]),
    });
  }
}
