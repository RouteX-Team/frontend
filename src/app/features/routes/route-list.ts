import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RoutesApi } from '../../core/api/routes-api';
import { RouteSummary } from '../../shared/models/route.model';

@Component({
  selector: 'app-route-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <header class="mb-5">
      <h1 class="text-2xl font-bold text-slate-800 m-0">Routes</h1>
      <p class="text-slate-500 mt-1">Browse routes, stops and timetables.</p>
    </header>

    <form
      [formGroup]="form"
      (ngSubmit)="search()"
      class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 mb-6 grid gap-3 sm:grid-cols-4"
    >
      <mat-form-field appearance="outline" class="sm:col-span-1">
        <mat-label>From</mat-label>
        <input matInput formControlName="from" placeholder="e.g. Main Gate" />
      </mat-form-field>
      <mat-form-field appearance="outline" class="sm:col-span-1">
        <mat-label>To</mat-label>
        <input matInput formControlName="to" placeholder="e.g. City Centre" />
      </mat-form-field>
      <mat-form-field appearance="outline" class="sm:col-span-1">
        <mat-label>Stop contains</mat-label>
        <input matInput formControlName="stop" placeholder="e.g. Library" />
      </mat-form-field>
      <div class="flex items-center gap-2">
        <button mat-flat-button color="primary" type="submit">
          <mat-icon>search</mat-icon>
          Search
        </button>
        <button mat-stroked-button type="button" (click)="reset()">Clear</button>
      </div>
    </form>

    @if (loading()) {
      <p class="text-slate-500">Loading routes…</p>
    } @else if (error()) {
      <p class="text-rose-600">{{ error() }}</p>
    } @else if (routes().length === 0) {
      <div class="rounded-2xl bg-white p-10 text-center text-slate-500 ring-1 ring-black/5">
        No routes match your search.
      </div>
    } @else {
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @for (route of routes(); track route.id) {
          <a
            [routerLink]="['/routes', route.id]"
            class="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 hover:ring-sky-300 hover:shadow-md transition no-underline"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-3">
                <span
                  class="grid place-items-center h-11 w-11 rounded-xl bg-sky-600 text-white font-bold"
                >
                  {{ route.number }}
                </span>
                <div>
                  <h2 class="text-base font-semibold text-slate-800 m-0 group-hover:text-sky-700">
                    {{ route.name }}
                  </h2>
                  <p class="text-xs text-slate-500 m-0">{{ route.stopCount }} stops</p>
                </div>
              </div>
              @if (!route.isActive) {
                <span class="text-xs rounded-full bg-slate-100 text-slate-500 px-2 py-0.5">
                  Inactive
                </span>
              }
            </div>
            @if (route.description) {
              <p class="text-sm text-slate-500 mt-3 m-0 line-clamp-2">{{ route.description }}</p>
            }
          </a>
        }
      </div>
    }
  `,
})
export class RouteList {
  private readonly api = inject(RoutesApi);
  private readonly fb = inject(FormBuilder);

  readonly routes = signal<RouteSummary[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({ from: [''], to: [''], stop: [''] });

  constructor() {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.getAll().subscribe({
      next: (routes) => {
        this.routes.set(routes);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load routes.');
        this.loading.set(false);
      },
    });
  }

  search(): void {
    const { from, to, stop } = this.form.getRawValue();
    if (!from && !to && !stop) {
      this.load();
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.api.search({ from, to, stop }).subscribe({
      next: (routes) => {
        this.routes.set(routes);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Search failed.');
        this.loading.set(false);
      },
    });
  }

  reset(): void {
    this.form.reset({ from: '', to: '', stop: '' });
    this.load();
  }
}
