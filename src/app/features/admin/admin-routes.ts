import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoutesApi } from '../../core/api/routes-api';
import { SchedulesApi } from '../../core/api/schedules-api';
import { StopsApi } from '../../core/api/stops-api';
import {
  RouteDetail,
  RouteInput,
  RouteSummary,
  Schedule,
  Stop,
} from '../../shared/models/route.model';
import { extractApiError } from '../../core/api/api-error';

interface SelectedStop {
  stopId: number;
  stopName: string;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

@Component({
  selector: 'app-admin-routes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
  ],
  template: `
    <header class="flex items-center justify-between gap-3 mb-5">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 m-0">Routes</h1>
        <p class="text-slate-500 mt-1 text-sm">Create routes, order their stops and set timetables.</p>
      </div>
      <button mat-flat-button color="primary" (click)="startCreate()">
        <mat-icon>add</mat-icon> New route
      </button>
    </header>

    @if (editing() !== null) {
      <div class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 mb-6">
        <h2 class="text-lg font-semibold text-slate-800 mt-0 mb-4">
          {{ editing() === 'new' ? 'New route' : 'Edit route' }}
        </h2>

        <form [formGroup]="form" (ngSubmit)="save()" class="grid gap-3 sm:grid-cols-6">
          <mat-form-field appearance="outline" class="sm:col-span-1">
            <mat-label>Number</mat-label>
            <input matInput formControlName="number" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="sm:col-span-3">
            <mat-label>Name</mat-label>
            <input matInput formControlName="name" />
          </mat-form-field>
          <div class="sm:col-span-2 flex items-center">
            <mat-slide-toggle formControlName="isActive">Active</mat-slide-toggle>
          </div>
          <mat-form-field appearance="outline" class="sm:col-span-6">
            <mat-label>Description</mat-label>
            <textarea matInput rows="2" formControlName="description"></textarea>
          </mat-form-field>

          <!-- Stop ordering -->
          <div class="sm:col-span-6">
            <h3 class="text-sm font-semibold text-slate-700 mb-2">Stops (in order)</h3>
            @if (selectedStops().length === 0) {
              <p class="text-sm text-slate-400 mb-2">No stops added yet.</p>
            }
            <ol class="space-y-2 mb-3">
              @for (s of selectedStops(); track s.stopId; let i = $index) {
                <li class="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                  <span class="grid place-items-center h-6 w-6 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">
                    {{ i + 1 }}
                  </span>
                  <span class="flex-1 text-sm text-slate-700">{{ s.stopName }}</span>
                  <button mat-icon-button type="button" (click)="moveStop(i, -1)" [disabled]="i === 0">
                    <mat-icon>arrow_upward</mat-icon>
                  </button>
                  <button mat-icon-button type="button" (click)="moveStop(i, 1)" [disabled]="i === selectedStops().length - 1">
                    <mat-icon>arrow_downward</mat-icon>
                  </button>
                  <button mat-icon-button type="button" color="warn" (click)="removeStop(i)">
                    <mat-icon>close</mat-icon>
                  </button>
                </li>
              }
            </ol>
            <mat-form-field appearance="outline" class="w-full sm:w-80">
              <mat-label>Add a stop</mat-label>
              <mat-select [value]="null" (selectionChange)="addStop($event.value)">
                @for (stop of availableStops(); track stop.id) {
                  <mat-option [value]="stop">{{ stop.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
          </div>

          <div class="sm:col-span-6 flex items-center gap-2">
            <button mat-flat-button color="primary" type="submit" [disabled]="saving()">
              {{ editing() === 'new' ? 'Create route' : 'Save changes' }}
            </button>
            <button mat-stroked-button type="button" (click)="cancel()">Cancel</button>
          </div>
        </form>

        <!-- Schedules (existing routes only) -->
        @if (editingRouteId(); as routeId) {
          <div class="mt-6 border-t border-slate-100 pt-5">
            <h3 class="text-sm font-semibold text-slate-700 mb-3">Timetable</h3>
            <ul class="divide-y divide-slate-100 mb-4">
              @for (s of schedules(); track s.id) {
                <li class="py-2 flex items-center justify-between text-sm">
                  <span class="font-medium text-slate-700">{{ s.departureTime }} → {{ s.arrivalTime }}</span>
                  <span class="text-xs text-slate-500 flex-1 text-center">{{ s.daysOfWeek }}</span>
                  <button mat-icon-button color="warn" type="button" (click)="removeSchedule(s)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </li>
              } @empty {
                <li class="py-2 text-sm text-slate-400">No schedules yet.</li>
              }
            </ul>

            <form [formGroup]="scheduleForm" (ngSubmit)="addSchedule(routeId)" class="grid gap-3 sm:grid-cols-4 items-center">
              <mat-form-field appearance="outline">
                <mat-label>Departure</mat-label>
                <input matInput type="time" formControlName="departureTime" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Arrival</mat-label>
                <input matInput type="time" formControlName="arrivalTime" />
              </mat-form-field>
              <mat-button-toggle-group multiple formControlName="days" class="sm:col-span-2 flex-wrap">
                @for (d of days; track d) {
                  <mat-button-toggle [value]="d">{{ d }}</mat-button-toggle>
                }
              </mat-button-toggle-group>
              <div class="sm:col-span-4">
                <button mat-stroked-button color="primary" type="submit">
                  <mat-icon>add</mat-icon> Add schedule
                </button>
              </div>
            </form>
          </div>
        }
      </div>
    }

    @if (loading()) {
      <p class="text-slate-500">Loading…</p>
    } @else {
      <div class="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th class="px-4 py-3 font-medium">Number</th>
              <th class="px-4 py-3 font-medium">Name</th>
              <th class="px-4 py-3 font-medium">Stops</th>
              <th class="px-4 py-3 font-medium">Status</th>
              <th class="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (route of routes(); track route.id) {
              <tr class="hover:bg-slate-50">
                <td class="px-4 py-3 font-semibold text-slate-700">{{ route.number }}</td>
                <td class="px-4 py-3 text-slate-700">{{ route.name }}</td>
                <td class="px-4 py-3 text-slate-500">{{ route.stopCount }}</td>
                <td class="px-4 py-3">
                  @if (route.isActive) {
                    <span class="text-xs rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5">Active</span>
                  } @else {
                    <span class="text-xs rounded-full bg-slate-100 text-slate-500 px-2 py-0.5">Inactive</span>
                  }
                </td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                  <button mat-icon-button (click)="startEdit(route)" aria-label="Edit">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="remove(route)" aria-label="Delete">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="5" class="px-4 py-8 text-center text-slate-500">No routes yet.</td></tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
})
export class AdminRoutes {
  private readonly api = inject(RoutesApi);
  private readonly stopsApi = inject(StopsApi);
  private readonly schedulesApi = inject(SchedulesApi);
  private readonly fb = inject(FormBuilder);
  private readonly snack = inject(MatSnackBar);

  readonly days = DAYS;
  readonly routes = signal<RouteSummary[]>([]);
  readonly allStops = signal<Stop[]>([]);
  readonly selectedStops = signal<SelectedStop[]>([]);
  readonly schedules = signal<Schedule[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly editing = signal<RouteDetail | 'new' | null>(null);
  readonly editingRouteId = signal<number | null>(null);

  readonly form = this.fb.nonNullable.group({
    number: ['', [Validators.required]],
    name: ['', [Validators.required]],
    description: [''],
    isActive: [true],
  });

  readonly scheduleForm = this.fb.nonNullable.group({
    departureTime: ['08:00', [Validators.required]],
    arrivalTime: ['08:30', [Validators.required]],
    days: this.fb.nonNullable.control<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']),
  });

  constructor() {
    this.load();
    this.stopsApi.getAll().subscribe({ next: (stops) => this.allStops.set(stops) });
  }

  availableStops(): Stop[] {
    const taken = new Set(this.selectedStops().map((s) => s.stopId));
    return this.allStops().filter((s) => !taken.has(s.id));
  }

  private load(): void {
    this.loading.set(true);
    this.api.getAll().subscribe({
      next: (routes) => {
        this.routes.set(routes);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  startCreate(): void {
    this.editing.set('new');
    this.editingRouteId.set(null);
    this.schedules.set([]);
    this.selectedStops.set([]);
    this.form.reset({ number: '', name: '', description: '', isActive: true });
  }

  startEdit(route: RouteSummary): void {
    this.api.getById(route.id).subscribe({
      next: (detail) => {
        this.editing.set(detail);
        this.editingRouteId.set(detail.id);
        this.form.reset({
          number: detail.number,
          name: detail.name,
          description: detail.description ?? '',
          isActive: detail.isActive,
        });
        this.selectedStops.set(detail.stops.map((s) => ({ stopId: s.stopId, stopName: s.stopName })));
        this.loadSchedules(detail.id);
      },
      error: (err) => this.snack.open(extractApiError(err), 'Dismiss', { duration: 4000 }),
    });
  }

  private loadSchedules(routeId: number): void {
    this.api.getSchedules(routeId).subscribe({ next: (s) => this.schedules.set(s) });
  }

  cancel(): void {
    this.editing.set(null);
    this.editingRouteId.set(null);
  }

  addStop(stop: Stop | null): void {
    if (!stop) return;
    this.selectedStops.update((list) => [...list, { stopId: stop.id, stopName: stop.name }]);
  }

  removeStop(index: number): void {
    this.selectedStops.update((list) => list.filter((_, i) => i !== index));
  }

  moveStop(index: number, delta: number): void {
    this.selectedStops.update((list) => {
      const next = [...list];
      const target = index + delta;
      if (target < 0 || target >= next.length) return list;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.selectedStops().length < 2) {
      this.snack.open('A route needs at least two stops.', 'Dismiss', { duration: 4000 });
      return;
    }
    this.saving.set(true);
    const value = this.form.getRawValue();
    const body: RouteInput = {
      name: value.name,
      number: value.number,
      description: value.description,
      isActive: value.isActive,
      stops: this.selectedStops().map((s, i) => ({ stopId: s.stopId, sequence: i + 1 })),
    };

    const editing = this.editing();
    const request$ =
      editing && editing !== 'new' ? this.api.update(editing.id, body) : this.api.create(body);

    request$.subscribe({
      next: (detail) => {
        this.saving.set(false);
        this.snack.open('Route saved.', 'OK', { duration: 2500 });
        this.editing.set(detail);
        this.editingRouteId.set(detail.id);
        this.loadSchedules(detail.id);
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        this.snack.open(extractApiError(err), 'Dismiss', { duration: 4000 });
      },
    });
  }

  remove(route: RouteSummary): void {
    if (!confirm(`Delete route "${route.number} · ${route.name}"?`)) return;
    this.api.remove(route.id).subscribe({
      next: () => {
        this.snack.open('Route deleted.', 'OK', { duration: 2500 });
        if (this.editingRouteId() === route.id) this.cancel();
        this.load();
      },
      error: (err) => this.snack.open(extractApiError(err), 'Dismiss', { duration: 4000 }),
    });
  }

  addSchedule(routeId: number): void {
    if (this.scheduleForm.invalid) return;
    const v = this.scheduleForm.getRawValue();
    this.api
      .createSchedule(routeId, {
        departureTime: `${v.departureTime}:00`,
        arrivalTime: `${v.arrivalTime}:00`,
        daysOfWeek: v.days.join(','),
      })
      .subscribe({
        next: () => {
          this.snack.open('Schedule added.', 'OK', { duration: 2000 });
          this.loadSchedules(routeId);
        },
        error: (err) => this.snack.open(extractApiError(err), 'Dismiss', { duration: 4000 }),
      });
  }

  removeSchedule(schedule: Schedule): void {
    this.schedulesApi.remove(schedule.id).subscribe({
      next: () => {
        this.snack.open('Schedule removed.', 'OK', { duration: 2000 });
        const routeId = this.editingRouteId();
        if (routeId) this.loadSchedules(routeId);
      },
      error: (err) => this.snack.open(extractApiError(err), 'Dismiss', { duration: 4000 }),
    });
  }
}
