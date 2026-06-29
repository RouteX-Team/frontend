import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { BusesApi } from '../../core/api/buses-api';
import { RoutesApi } from '../../core/api/routes-api';
import { UsersApi } from '../../core/api/users-api';
import { Bus, BUS_STATUS_LABEL, BUS_STATUSES, BusStatus } from '../../shared/models/bus.model';
import { RouteSummary } from '../../shared/models/route.model';
import { User } from '../../shared/models/user.model';
import { extractApiError } from '../../core/api/api-error';

@Component({
  selector: 'app-admin-buses',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <header class="flex items-center justify-between gap-3 mb-5">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 m-0">Buses</h1>
        <p class="text-slate-500 mt-1 text-sm">Fleet, capacity, status and assignments.</p>
      </div>
      <button mat-flat-button color="primary" (click)="startCreate()">
        <mat-icon>add</mat-icon> New bus
      </button>
    </header>

    @if (editing() !== null) {
      <form
        [formGroup]="form"
        (ngSubmit)="save()"
        class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 mb-6 grid gap-3 sm:grid-cols-3"
      >
        <mat-form-field appearance="outline">
          <mat-label>Bus number</mat-label>
          <input matInput formControlName="busNumber" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Capacity</mat-label>
          <input matInput type="number" formControlName="capacity" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            @for (s of statuses; track s) {
              <mat-option [value]="s">{{ statusLabel(s) }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Assigned route</mat-label>
          <mat-select formControlName="currentRouteId">
            <mat-option [value]="null">— None —</mat-option>
            @for (r of routes(); track r.id) {
              <mat-option [value]="r.id">{{ r.number }} · {{ r.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Assigned driver</mat-label>
          <mat-select formControlName="assignedDriverId">
            <mat-option [value]="null">— None —</mat-option>
            @for (d of drivers(); track d.id) {
              <mat-option [value]="d.id">{{ d.fullName }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <div class="flex items-center gap-2 sm:col-span-3">
          <button mat-flat-button color="primary" type="submit" [disabled]="saving()">
            {{ editing() === 'new' ? 'Create' : 'Save changes' }}
          </button>
          <button mat-stroked-button type="button" (click)="cancel()">Cancel</button>
        </div>
      </form>
    }

    @if (loading()) {
      <p class="text-slate-500">Loading…</p>
    } @else {
      <div class="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th class="px-4 py-3 font-medium">Bus</th>
              <th class="px-4 py-3 font-medium">Capacity</th>
              <th class="px-4 py-3 font-medium">Status</th>
              <th class="px-4 py-3 font-medium">Route</th>
              <th class="px-4 py-3 font-medium">Driver</th>
              <th class="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (bus of buses(); track bus.id) {
              <tr class="hover:bg-slate-50">
                <td class="px-4 py-3 font-medium text-slate-700">{{ bus.busNumber }}</td>
                <td class="px-4 py-3 text-slate-500">{{ bus.capacity }}</td>
                <td class="px-4 py-3">
                  <span class="text-xs rounded-full px-2 py-0.5" [class]="statusClass(bus.status)">
                    {{ statusLabel(bus.status) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-slate-500">{{ bus.currentRouteName ?? '—' }}</td>
                <td class="px-4 py-3 text-slate-500">{{ bus.assignedDriverName ?? '—' }}</td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                  <button mat-icon-button (click)="startEdit(bus)" aria-label="Edit">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="remove(bus)" aria-label="Delete">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="px-4 py-8 text-center text-slate-500">No buses yet.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
})
export class AdminBuses {
  private readonly api = inject(BusesApi);
  private readonly routesApi = inject(RoutesApi);
  private readonly usersApi = inject(UsersApi);
  private readonly fb = inject(FormBuilder);
  private readonly snack = inject(MatSnackBar);

  readonly statuses = BUS_STATUSES;
  readonly buses = signal<Bus[]>([]);
  readonly routes = signal<RouteSummary[]>([]);
  readonly drivers = signal<User[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly editing = signal<Bus | 'new' | null>(null);

  readonly form = this.fb.nonNullable.group({
    busNumber: ['', [Validators.required]],
    capacity: [40, [Validators.required, Validators.min(1)]],
    status: ['OffDuty' as BusStatus, [Validators.required]],
    currentRouteId: this.fb.control<number | null>(null),
    assignedDriverId: this.fb.control<number | null>(null),
  });

  constructor() {
    this.load();
    forkJoin({
      routes: this.routesApi.getAll(),
      drivers: this.usersApi.getAll('Driver'),
    }).subscribe({
      next: ({ routes, drivers }) => {
        this.routes.set(routes);
        this.drivers.set(drivers);
      },
      error: () => undefined,
    });
  }

  statusLabel(status: BusStatus): string {
    return BUS_STATUS_LABEL[status];
  }

  statusClass(status: BusStatus): string {
    switch (status) {
      case 'InService':
        return 'bg-emerald-50 text-emerald-700';
      case 'Maintenance':
        return 'bg-amber-50 text-amber-700';
      default:
        return 'bg-slate-100 text-slate-500';
    }
  }

  private load(): void {
    this.loading.set(true);
    this.api.getAll().subscribe({
      next: (buses) => {
        this.buses.set(buses);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  startCreate(): void {
    this.editing.set('new');
    this.form.reset({
      busNumber: '',
      capacity: 40,
      status: 'OffDuty',
      currentRouteId: null,
      assignedDriverId: null,
    });
  }

  startEdit(bus: Bus): void {
    this.editing.set(bus);
    this.form.reset({
      busNumber: bus.busNumber,
      capacity: bus.capacity,
      status: bus.status,
      currentRouteId: bus.currentRouteId,
      assignedDriverId: bus.assignedDriverId,
    });
  }

  cancel(): void {
    this.editing.set(null);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const value = this.form.getRawValue();
    const editing = this.editing();
    const request$ =
      editing && editing !== 'new' ? this.api.update(editing.id, value) : this.api.create(value);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.editing.set(null);
        this.snack.open('Bus saved.', 'OK', { duration: 2500 });
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        this.snack.open(extractApiError(err), 'Dismiss', { duration: 4000 });
      },
    });
  }

  remove(bus: Bus): void {
    if (!confirm(`Delete bus "${bus.busNumber}"?`)) return;
    this.api.remove(bus.id).subscribe({
      next: () => {
        this.snack.open('Bus deleted.', 'OK', { duration: 2500 });
        this.load();
      },
      error: (err) => this.snack.open(extractApiError(err), 'Dismiss', { duration: 4000 }),
    });
  }
}
