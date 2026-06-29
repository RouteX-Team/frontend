import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { RoutesApi } from '../../core/api/routes-api';
import { BusesApi } from '../../core/api/buses-api';
import { DevApi } from '../../core/api/dev-api';
import { TrackingStore } from '../../core/tracking/tracking-store';
import { TrackingHubClient } from '../../core/realtime/tracking-hub';
import { RouteMap, LiveBusMarker } from '../../shared/ui/route-map';
import { RouteStop, RouteSummary } from '../../shared/models/route.model';
import { Bus } from '../../shared/models/bus.model';
import { EtaPanel } from './eta-panel';

@Component({
  selector: 'app-live-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatFormFieldModule, MatIconModule, MatSelectModule, RouteMap, EtaPanel],
  template: `
    <header class="flex flex-wrap items-end gap-4 mb-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 m-0">Live tracking</h1>
        <p class="text-slate-500 m-0 text-sm">Pick a route to watch its buses move in real time.</p>
      </div>
      <span class="ml-auto inline-flex items-center gap-2 text-sm">
        <span
          class="h-2.5 w-2.5 rounded-full"
          [class.bg-emerald-500]="hub.status() === 'connected'"
          [class.bg-amber-400]="hub.status() === 'connecting'"
          [class.bg-slate-300]="hub.status() === 'disconnected'"
        ></span>
        <span class="text-slate-500 capitalize">{{ hub.status() }}</span>
      </span>
    </header>

    <div class="flex flex-wrap items-center gap-3 mb-4">
      <mat-form-field appearance="outline" class="w-72">
        <mat-label>Route</mat-label>
        <mat-select [value]="selectedRouteId()" (valueChange)="onSelect($event)">
          @for (r of routes(); track r.id) {
            <mat-option [value]="r.id">{{ r.number }} — {{ r.name }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      @if (selectedRouteId() !== null) {
        <span
          class="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700"
        >
          <mat-icon class="!h-4 !w-4 !text-base">directions_bus</mat-icon>
          {{ tracking.activeCount() }} live
        </span>

        <button mat-stroked-button type="button" [disabled]="simBusy()" (click)="runDemo()">
          <mat-icon>play_circle</mat-icon>
          {{ simBusy() ? 'Starting…' : 'Demo: simulate a bus' }}
        </button>
      }

      @if (demoMessage(); as msg) {
        <span class="text-sm text-slate-500">{{ msg }}</span>
      }
    </div>

    <div class="grid gap-6 lg:grid-cols-5">
      <div class="lg:col-span-3 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-black/5">
        <div class="h-[520px]">
          <app-route-map [stops]="stops()" [buses]="markers()" [autoFit]="autoFit()" />
        </div>
      </div>

      <div class="lg:col-span-2">
        <app-eta-panel
          [routeId]="selectedRouteId()"
          [stops]="stops()"
          [refreshKey]="refreshKey()"
        />
        @if (selectedRouteId() !== null && tracking.activeCount() === 0) {
          <p class="mt-3 text-sm text-slate-500">
            No buses are broadcasting on this route yet. Use “Demo: simulate a bus”, or have a
            driver start a trip.
          </p>
        }
      </div>
    </div>
  `,
})
export class LiveMap {
  private readonly routesApi = inject(RoutesApi);
  private readonly busesApi = inject(BusesApi);
  private readonly devApi = inject(DevApi);
  protected readonly tracking = inject(TrackingStore);
  protected readonly hub = inject(TrackingHubClient);

  readonly routes = signal<RouteSummary[]>([]);
  readonly stops = signal<RouteStop[]>([]);
  readonly selectedRouteId = signal<number | null>(null);
  readonly autoFit = signal(true);
  readonly simBusy = signal(false);
  readonly demoMessage = signal<string | null>(null);

  private buses: Bus[] = [];

  readonly markers = computed<LiveBusMarker[]>(() =>
    this.tracking.busesForSelectedRoute().map((b) => ({
      id: b.busId,
      label: `${b.busNumber} • ${Math.round(b.speed)} km/h${b.isStale ? ' • offline' : ''}`,
      latitude: b.latitude,
      longitude: b.longitude,
      heading: b.heading,
      stale: b.isStale,
    })),
  );

  // Changes whenever a live position moves, so the ETA panel re-fetches promptly.
  readonly refreshKey = computed(() =>
    this.tracking.busesForSelectedRoute().reduce((acc, b) => acc + b.latitude + b.longitude, 0),
  );

  constructor() {
    this.routesApi.getAll(false).subscribe((r) => this.routes.set(r));
    this.busesApi.getAll().subscribe((b) => (this.buses = b));

    // Re-fit the map only on a route change, not on every live position update.
    effect(() => {
      this.selectedRouteId();
      this.autoFit.set(true);
    });
  }

  onSelect(routeId: number): void {
    this.selectedRouteId.set(routeId);
    this.demoMessage.set(null);
    this.routesApi.getById(routeId).subscribe((detail) => this.stops.set(detail.stops));
    void this.tracking.watchRoute(routeId);
    // Stop auto-fitting once the first live updates arrive so the view stays put.
    setTimeout(() => this.autoFit.set(false), 1500);
  }

  runDemo(): void {
    const routeId = this.selectedRouteId();
    if (routeId == null) return;
    const bus =
      this.buses.find((b) => b.currentRouteId === routeId) ??
      this.buses.find((b) => b.assignedDriverId != null) ??
      this.buses[0];
    if (!bus) {
      this.demoMessage.set('No buses available to simulate.');
      return;
    }
    this.simBusy.set(true);
    this.demoMessage.set(null);
    this.devApi.simulateTrip(routeId, bus.id, 1).subscribe({
      next: () => {
        this.simBusy.set(false);
        this.demoMessage.set(`Simulating ${bus.busNumber} along this route…`);
      },
      error: () => {
        this.simBusy.set(false);
        this.demoMessage.set('Could not start simulation (a trip may already be running).');
      },
    });
  }
}
