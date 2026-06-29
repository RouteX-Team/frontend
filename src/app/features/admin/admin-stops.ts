import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StopsApi } from '../../core/api/stops-api';
import { Stop } from '../../shared/models/route.model';
import { extractApiError } from '../../core/api/api-error';

@Component({
  selector: 'app-admin-stops',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <header class="flex items-center justify-between gap-3 mb-5">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 m-0">Stops</h1>
        <p class="text-slate-500 mt-1 text-sm">Manage stop locations used by routes.</p>
      </div>
      <button mat-flat-button color="primary" (click)="startCreate()">
        <mat-icon>add</mat-icon> New stop
      </button>
    </header>

    @if (editing() !== null) {
      <form
        [formGroup]="form"
        (ngSubmit)="save()"
        class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 mb-6 grid gap-3 sm:grid-cols-4"
      >
        <mat-form-field appearance="outline" class="sm:col-span-2">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Latitude</mat-label>
          <input matInput type="number" step="0.0001" formControlName="latitude" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Longitude</mat-label>
          <input matInput type="number" step="0.0001" formControlName="longitude" />
        </mat-form-field>
        <div class="flex items-center gap-2 sm:col-span-4">
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
              <th class="px-4 py-3 font-medium">Name</th>
              <th class="px-4 py-3 font-medium">Latitude</th>
              <th class="px-4 py-3 font-medium">Longitude</th>
              <th class="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (stop of stops(); track stop.id) {
              <tr class="hover:bg-slate-50">
                <td class="px-4 py-3 font-medium text-slate-700">{{ stop.name }}</td>
                <td class="px-4 py-3 text-slate-500">{{ stop.latitude }}</td>
                <td class="px-4 py-3 text-slate-500">{{ stop.longitude }}</td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                  <button mat-icon-button (click)="startEdit(stop)" aria-label="Edit">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="remove(stop)" aria-label="Delete">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="px-4 py-8 text-center text-slate-500">No stops yet.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
})
export class AdminStops {
  private readonly api = inject(StopsApi);
  private readonly fb = inject(FormBuilder);
  private readonly snack = inject(MatSnackBar);

  readonly stops = signal<Stop[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly editing = signal<Stop | 'new' | null>(null);
  readonly editingId = computed(() => {
    const e = this.editing();
    return e && e !== 'new' ? e.id : null;
  });

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    latitude: [0, [Validators.required, Validators.min(-90), Validators.max(90)]],
    longitude: [0, [Validators.required, Validators.min(-180), Validators.max(180)]],
  });

  constructor() {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.api.getAll().subscribe({
      next: (stops) => {
        this.stops.set(stops);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  startCreate(): void {
    this.editing.set('new');
    this.form.reset({ name: '', latitude: 33.656, longitude: 73.097 });
  }

  startEdit(stop: Stop): void {
    this.editing.set(stop);
    this.form.reset({ name: stop.name, latitude: stop.latitude, longitude: stop.longitude });
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
      editing && editing !== 'new'
        ? this.api.update(editing.id, value)
        : this.api.create(value);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.editing.set(null);
        this.snack.open('Stop saved.', 'OK', { duration: 2500 });
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        this.snack.open(extractApiError(err), 'Dismiss', { duration: 4000 });
      },
    });
  }

  remove(stop: Stop): void {
    if (!confirm(`Delete stop "${stop.name}"?`)) return;
    this.api.remove(stop.id).subscribe({
      next: () => {
        this.snack.open('Stop deleted.', 'OK', { duration: 2500 });
        this.load();
      },
      error: (err) => this.snack.open(extractApiError(err), 'Dismiss', { duration: 4000 }),
    });
  }
}
