import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AnnouncementsApi } from '../../core/api/announcements-api';
import { RoutesApi } from '../../core/api/routes-api';
import {
  Announcement,
  AnnouncementSeverity,
} from '../../shared/models/notification.model';
import { RouteSummary } from '../../shared/models/route.model';
import { extractApiError } from '../../core/api/api-error';

const SEVERITIES: AnnouncementSeverity[] = ['Info', 'Warning', 'Critical'];

@Component({
  selector: 'app-admin-announcements',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
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
        <h1 class="text-2xl font-bold text-slate-800 m-0">Announcements</h1>
        <p class="text-slate-500 mt-1 text-sm">
          Publish service updates and disruptions. Students are notified in real time.
        </p>
      </div>
      <button mat-flat-button color="primary" (click)="startCreate()">
        <mat-icon>add</mat-icon> New announcement
      </button>
    </header>

    @if (editing() !== null) {
      <form
        [formGroup]="form"
        (ngSubmit)="save()"
        class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 mb-6 grid gap-3 sm:grid-cols-2"
      >
        <mat-form-field appearance="outline" class="sm:col-span-2">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Severity</mat-label>
          <mat-select formControlName="severity">
            @for (s of severities; track s) {
              <mat-option [value]="s">{{ s }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Route (optional)</mat-label>
          <mat-select formControlName="routeId">
            <mat-option [value]="null">— All routes —</mat-option>
            @for (r of routes(); track r.id) {
              <mat-option [value]="r.id">{{ r.number }} · {{ r.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="sm:col-span-2">
          <mat-label>Message</mat-label>
          <textarea matInput rows="3" formControlName="body"></textarea>
        </mat-form-field>
        <div class="flex items-center gap-2 sm:col-span-2">
          <button mat-flat-button color="primary" type="submit" [disabled]="saving()">
            {{ editing() === 'new' ? 'Publish' : 'Save changes' }}
          </button>
          <button mat-stroked-button type="button" (click)="cancel()">Cancel</button>
        </div>
      </form>
    }

    @if (loading()) {
      <p class="text-slate-500">Loading…</p>
    } @else {
      <ul class="space-y-3">
        @for (a of announcements(); track a.id) {
          <li
            class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 border-l-4"
            [class]="severityClass(a.severity)"
          >
            <div class="flex items-center gap-2">
              <span class="text-xs rounded-full px-2 py-0.5" [class]="severityBadge(a.severity)">
                {{ a.severity }}
              </span>
              <span class="font-semibold text-slate-800">{{ a.title }}</span>
              @if (a.routeName) {
                <span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                  {{ a.routeName }}
                </span>
              }
              <span class="ml-auto text-xs text-slate-400">{{ a.createdAt | date: 'short' }}</span>
              <button mat-icon-button (click)="startEdit(a)" aria-label="Edit">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="remove(a)" aria-label="Delete">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
            <p class="m-0 mt-1 text-sm text-slate-600">{{ a.body }}</p>
          </li>
        } @empty {
          <li class="rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm ring-1 ring-black/5">
            No announcements yet.
          </li>
        }
      </ul>
    }
  `,
})
export class AdminAnnouncements {
  private readonly api = inject(AnnouncementsApi);
  private readonly routesApi = inject(RoutesApi);
  private readonly fb = inject(FormBuilder);
  private readonly snack = inject(MatSnackBar);

  readonly severities = SEVERITIES;
  readonly announcements = signal<Announcement[]>([]);
  readonly routes = signal<RouteSummary[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly editing = signal<Announcement | 'new' | null>(null);

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(150)]],
    body: ['', [Validators.required, Validators.maxLength(2000)]],
    severity: ['Info' as AnnouncementSeverity, [Validators.required]],
    routeId: this.fb.control<number | null>(null),
  });

  constructor() {
    this.load();
    this.routesApi.getAll().subscribe({
      next: (routes) => this.routes.set(routes),
      error: () => undefined,
    });
  }

  severityClass(severity: AnnouncementSeverity): string {
    switch (severity) {
      case 'Critical':
        return 'border-rose-500';
      case 'Warning':
        return 'border-amber-500';
      default:
        return 'border-sky-500';
    }
  }

  severityBadge(severity: AnnouncementSeverity): string {
    switch (severity) {
      case 'Critical':
        return 'bg-rose-50 text-rose-700';
      case 'Warning':
        return 'bg-amber-50 text-amber-700';
      default:
        return 'bg-sky-50 text-sky-700';
    }
  }

  private load(): void {
    this.loading.set(true);
    this.api.list().subscribe({
      next: (a) => {
        this.announcements.set(a);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  startCreate(): void {
    this.editing.set('new');
    this.form.reset({ title: '', body: '', severity: 'Info', routeId: null });
  }

  startEdit(a: Announcement): void {
    this.editing.set(a);
    this.form.reset({ title: a.title, body: a.body, severity: a.severity, routeId: a.routeId });
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
        this.snack.open('Announcement published.', 'OK', { duration: 2500 });
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        this.snack.open(extractApiError(err), 'Dismiss', { duration: 4000 });
      },
    });
  }

  remove(a: Announcement): void {
    if (!confirm(`Delete announcement "${a.title}"?`)) return;
    this.api.remove(a.id).subscribe({
      next: () => {
        this.snack.open('Announcement deleted.', 'OK', { duration: 2500 });
        this.load();
      },
      error: (err) => this.snack.open(extractApiError(err), 'Dismiss', { duration: 4000 }),
    });
  }
}
