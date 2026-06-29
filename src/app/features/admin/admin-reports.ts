import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReportsApi } from '../../core/api/reports-api';
import { RouteUsage } from '../../shared/models/report.model';

@Component({
  selector: 'app-admin-reports',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <header class="flex flex-wrap items-end justify-between gap-3 mb-5">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 m-0">Route usage report</h1>
        <p class="text-slate-500 mt-1 text-sm">Trips, buses and pings per route over a date range.</p>
      </div>
      <button mat-flat-button color="primary" [disabled]="exporting()" (click)="exportCsv()">
        <mat-icon>download</mat-icon> {{ exporting() ? 'Exporting…' : 'Export CSV' }}
      </button>
    </header>

    <div class="flex flex-wrap items-center gap-3 mb-4">
      <mat-form-field appearance="outline">
        <mat-label>From</mat-label>
        <input matInput type="date" [ngModel]="from()" (ngModelChange)="from.set($event)" />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>To</mat-label>
        <input matInput type="date" [ngModel]="to()" (ngModelChange)="to.set($event)" />
      </mat-form-field>
      <button mat-stroked-button type="button" (click)="load()">
        <mat-icon>refresh</mat-icon> Apply
      </button>
    </div>

    @if (loading()) {
      <p class="text-slate-500">Loading…</p>
    } @else {
      <div class="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th class="px-4 py-3 font-medium">Route</th>
              <th class="px-4 py-3 font-medium text-right">Trips</th>
              <th class="px-4 py-3 font-medium text-right">Completed</th>
              <th class="px-4 py-3 font-medium text-right">Buses</th>
              <th class="px-4 py-3 font-medium text-right">Pings</th>
              <th class="px-4 py-3 font-medium">Last trip</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (r of rows(); track r.routeId) {
              <tr class="hover:bg-slate-50">
                <td class="px-4 py-3 font-medium text-slate-700">{{ r.routeNumber }} · {{ r.routeName }}</td>
                <td class="px-4 py-3 text-right text-slate-600">{{ r.tripCount }}</td>
                <td class="px-4 py-3 text-right text-slate-600">{{ r.completedTripCount }}</td>
                <td class="px-4 py-3 text-right text-slate-600">{{ r.distinctBusCount }}</td>
                <td class="px-4 py-3 text-right text-slate-600">{{ r.totalPings }}</td>
                <td class="px-4 py-3 text-slate-500">
                  {{ r.lastTripStartedAt ? (r.lastTripStartedAt | date: 'short') : '—' }}
                </td>
              </tr>
            } @empty {
              <tr><td colspan="6" class="px-4 py-8 text-center text-slate-500">No usage in this range.</td></tr>
            }
          </tbody>
          @if (rows().length > 0) {
            <tfoot class="bg-slate-50 font-medium text-slate-700">
              <tr>
                <td class="px-4 py-3">Total</td>
                <td class="px-4 py-3 text-right">{{ totals().trips }}</td>
                <td class="px-4 py-3 text-right">{{ totals().completed }}</td>
                <td class="px-4 py-3 text-right">—</td>
                <td class="px-4 py-3 text-right">{{ totals().pings }}</td>
                <td class="px-4 py-3"></td>
              </tr>
            </tfoot>
          }
        </table>
      </div>
    }
  `,
})
export class AdminReports {
  private readonly api = inject(ReportsApi);

  readonly rows = signal<RouteUsage[]>([]);
  readonly loading = signal(true);
  readonly exporting = signal(false);
  readonly from = signal<string>('');
  readonly to = signal<string>('');

  readonly totals = computed(() =>
    this.rows().reduce(
      (acc, r) => ({
        trips: acc.trips + r.tripCount,
        completed: acc.completed + r.completedTripCount,
        pings: acc.pings + r.totalPings,
      }),
      { trips: 0, completed: 0, pings: 0 },
    ),
  );

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api.routeUsage(this.from() || null, this.to() || null).subscribe({
      next: (report) => {
        this.rows.set(report.rows);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  exportCsv(): void {
    this.exporting.set(true);
    this.api.exportRouteUsageCsv(this.from() || null, this.to() || null).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'route-usage.csv';
        link.click();
        URL.revokeObjectURL(url);
        this.exporting.set(false);
      },
      error: () => this.exporting.set(false),
    });
  }
}
