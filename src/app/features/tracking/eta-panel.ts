import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TrackingApi } from '../../core/api/tracking-api';
import { RouteStop } from '../../shared/models/route.model';
import { StopEta } from '../../shared/models/tracking.model';

@Component({
  selector: 'app-eta-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, MatFormFieldModule, MatIconModule, MatSelectModule],
  template: `
    <section class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <h2 class="text-base font-semibold text-slate-800 mt-0 mb-3">Arrivals</h2>

      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Stop</mat-label>
        <mat-select [value]="selectedStopId()" (valueChange)="selectedStopId.set($event)">
          @for (s of stops(); track s.stopId) {
            <mat-option [value]="s.stopId">{{ s.sequence }}. {{ s.stopName }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      @if (eta(); as e) {
        @if (e.hasActiveBus) {
          <div class="rounded-xl bg-emerald-50 p-4 text-center">
            <p class="m-0 text-3xl font-bold text-emerald-700">{{ e.etaText }}</p>
            <p class="m-0 mt-1 text-sm text-emerald-800/80">
              {{ e.busNumber }} · {{ e.distanceMeters | number: '1.0-0' }} m away
            </p>
          </div>
        } @else {
          <div class="rounded-xl bg-slate-50 p-4 text-center">
            <mat-icon class="text-slate-400">schedule</mat-icon>
            <p class="m-0 text-sm text-slate-600">{{ e.etaText }}</p>
            @if (e.nextScheduledDeparture; as next) {
              <p class="m-0 mt-1 text-lg font-semibold text-slate-700">{{ next }}</p>
            }
          </div>
        }
      } @else {
        <p class="text-sm text-slate-500 m-0">Select a stop to see arrivals.</p>
      }
    </section>
  `,
})
export class EtaPanel {
  private readonly api = inject(TrackingApi);

  readonly routeId = input<number | null>(null);
  readonly stops = input<RouteStop[]>([]);
  /** Bumped by the parent on each live position update to refresh the ETA promptly. */
  readonly refreshKey = input(0);

  readonly selectedStopId = signal<number | null>(null);
  readonly eta = signal<StopEta | null>(null);

  constructor() {
    // Default to the route's final stop (a natural "destination") when stops load.
    effect(() => {
      const stops = this.stops();
      const current = this.selectedStopId();
      if (stops.length === 0) {
        this.selectedStopId.set(null);
        return;
      }
      if (current == null || !stops.some((s) => s.stopId === current)) {
        this.selectedStopId.set(stops[stops.length - 1].stopId);
      }
    });

    // Re-fetch whenever the stop, route, or live positions change.
    effect(() => {
      this.routeId();
      this.selectedStopId();
      this.refreshKey();
      this.fetch();
    });

    // Steady poll so the ETA keeps ticking even without new socket events.
    const timer = setInterval(() => this.fetch(), 4000);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  private fetch(): void {
    const routeId = this.routeId();
    const stopId = this.selectedStopId();
    if (routeId == null || stopId == null) {
      this.eta.set(null);
      return;
    }
    this.api.getEta(stopId, routeId).subscribe({
      next: (e) => this.eta.set(e),
      error: () => this.eta.set(null),
    });
  }
}
