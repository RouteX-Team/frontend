import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FavoritesApi } from '../../core/api/favorites-api';
import { Favorite } from '../../shared/models/notification.model';

@Component({
  selector: 'app-favorites-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <header class="mb-4">
      <h1 class="text-2xl font-bold text-slate-800 m-0">Favorite routes</h1>
      <p class="text-slate-500 m-0 text-sm">
        Get approaching-bus alerts for the routes you ride most.
      </p>
    </header>

    @if (loading()) {
      <p class="text-slate-500">Loading…</p>
    } @else if (favorites().length === 0) {
      <div class="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
        <mat-icon class="text-slate-300" style="font-size:48px;height:48px;width:48px">star_border</mat-icon>
        <p class="text-slate-600">You haven't favorited any routes yet.</p>
        <a mat-flat-button color="primary" routerLink="/routes">
          <mat-icon>alt_route</mat-icon> Browse routes
        </a>
      </div>
    } @else {
      <ul class="grid gap-3 sm:grid-cols-2">
        @for (f of favorites(); track f.id) {
          <li class="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <span class="grid place-items-center h-11 w-11 rounded-xl bg-sky-600 text-white font-bold">
              {{ f.routeNumber }}
            </span>
            <div class="min-w-0">
              <p class="m-0 font-medium text-slate-800 truncate">{{ f.routeName }}</p>
              <a [routerLink]="['/routes', f.routeId]" class="text-xs text-sky-600 hover:underline">
                View route
              </a>
            </div>
            <button
              mat-icon-button
              color="warn"
              class="ml-auto"
              aria-label="Remove favorite"
              (click)="remove(f.routeId)"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </li>
        }
      </ul>
    }
  `,
})
export class FavoritesPage {
  private readonly api = inject(FavoritesApi);

  readonly favorites = signal<Favorite[]>([]);
  readonly loading = signal(true);

  constructor() {
    this.api.list().subscribe({
      next: (f) => {
        this.favorites.set(f);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  remove(routeId: number): void {
    this.api.remove(routeId).subscribe(() => {
      this.favorites.update((list) => list.filter((f) => f.routeId !== routeId));
    });
  }
}
