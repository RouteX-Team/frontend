import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { RoutesApi } from '../../core/api/routes-api';
import { BusesApi } from '../../core/api/buses-api';
import { TripsApi } from '../../core/api/trips-api';
import { TrackingHubClient } from '../../core/realtime/tracking-hub';
import { RouteStop, RouteSummary } from '../../shared/models/route.model';
import { Bus } from '../../shared/models/bus.model';
import { Trip } from '../../shared/models/tracking.model';

interface SentPing {
  lat: number;
  lng: number;
  speed: number;
  at: Date;
}

/** Great-circle bearing (degrees) from point A to point B. */
function bearing(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLng = toRad(bLng - aLng);
  const y = Math.sin(dLng) * Math.cos(toRad(bLat));
  const x =
    Math.cos(toRad(aLat)) * Math.sin(toRad(bLat)) -
    Math.sin(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.cos(dLng);
  return (Math.atan2(y, x) * 180) / Math.PI;
}

@Component({
  selector: 'app-driver-console',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, DecimalPipe, MatButtonModule, MatFormFieldModule, MatIconModule, MatSelectModule],
  template: `
    <header class="mb-4">
      <h1 class="text-2xl font-bold text-slate-800 m-0">Driver console</h1>
      <p class="text-slate-500 m-0 text-sm">Start a trip and broadcast your bus's live location.</p>
    </header>

    @if (loading()) {
      <p class="text-slate-500">Loading…</p>
    } @else if (trip(); as t) {
      <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 max-w-2xl">
        <div class="flex items-center gap-3">
          <span class="grid place-items-center h-12 w-12 rounded-xl bg-emerald-600 text-white">
            <mat-icon>directions_bus</mat-icon>
          </span>
          <div>
            <h2 class="m-0 text-lg font-semibold text-slate-800">{{ t.busNumber }} · {{ t.routeName }}</h2>
            <p class="m-0 text-sm text-slate-500">
              Trip #{{ t.id }} · started {{ t.startedAt | date: 'shortTime' }}
            </p>
          </div>
          <span
            class="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium"
            [class.bg-emerald-50]="broadcasting()"
            [class.text-emerald-700]="broadcasting()"
            [class.bg-slate-100]="!broadcasting()"
            [class.text-slate-500]="!broadcasting()"
          >
            <span class="h-2 w-2 rounded-full" [class.bg-emerald-500]="broadcasting()" [class.bg-slate-400]="!broadcasting()"></span>
            {{ broadcasting() ? 'Broadcasting' : 'Idle' }}
          </span>
        </div>

        <div class="mt-6 flex flex-wrap gap-3">
          <button mat-flat-button color="primary" type="button" (click)="toggleGps()">
            <mat-icon>{{ gpsOn() ? 'gps_off' : 'my_location' }}</mat-icon>
            {{ gpsOn() ? 'Stop GPS broadcast' : 'Broadcast via GPS' }}
          </button>
          <button mat-stroked-button type="button" (click)="toggleDemo()">
            <mat-icon>{{ demoOn() ? 'stop' : 'route' }}</mat-icon>
            {{ demoOn() ? 'Stop demo drive' : 'Demo: drive the route' }}
          </button>
          <button mat-stroked-button color="warn" type="button" class="ml-auto" (click)="endTrip()">
            <mat-icon>flag</mat-icon> End trip
          </button>
        </div>

        @if (hint(); as h) {
          <p class="mt-4 mb-0 text-sm text-amber-700">{{ h }}</p>
        }

        @if (lastPing(); as p) {
          <div class="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
            Last sent: {{ p.lat | number: '1.5-5' }}, {{ p.lng | number: '1.5-5' }} ·
            {{ p.speed | number: '1.0-0' }} km/h · {{ p.at | date: 'mediumTime' }}
          </div>
        }
      </section>
    } @else {
      <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 max-w-xl">
        <h2 class="m-0 mb-4 text-lg font-semibold text-slate-800">Start a trip</h2>
        <div class="grid gap-4 sm:grid-cols-2">
          <mat-form-field appearance="outline">
            <mat-label>Route</mat-label>
            <mat-select [value]="routeId()" (valueChange)="routeId.set($event)">
              @for (r of routes(); track r.id) {
                <mat-option [value]="r.id">{{ r.number }} — {{ r.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Bus</mat-label>
            <mat-select [value]="busId()" (valueChange)="busId.set($event)">
              @for (b of buses(); track b.id) {
                <mat-option [value]="b.id">{{ b.busNumber }} (cap {{ b.capacity }})</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
        @if (error(); as e) {
          <p class="text-rose-600 text-sm">{{ e }}</p>
        }
        <button
          mat-flat-button
          color="primary"
          type="button"
          class="mt-2"
          [disabled]="starting() || routeId() === null || busId() === null"
          (click)="startTrip()"
        >
          <mat-icon>play_arrow</mat-icon> {{ starting() ? 'Starting…' : 'Start trip' }}
        </button>
      </section>
    }
  `,
})
export class DriverConsole {
  private readonly routesApi = inject(RoutesApi);
  private readonly busesApi = inject(BusesApi);
  private readonly tripsApi = inject(TripsApi);
  private readonly hub = inject(TrackingHubClient);

  readonly routes = signal<RouteSummary[]>([]);
  readonly buses = signal<Bus[]>([]);
  readonly trip = signal<Trip | null>(null);
  readonly loading = signal(true);
  readonly starting = signal(false);
  readonly error = signal<string | null>(null);
  readonly hint = signal<string | null>(null);
  readonly lastPing = signal<SentPing | null>(null);

  readonly routeId = signal<number | null>(null);
  readonly busId = signal<number | null>(null);

  readonly gpsOn = signal(false);
  readonly demoOn = signal(false);
  readonly broadcasting = computed(() => this.gpsOn() || this.demoOn());

  private geoWatchId: number | null = null;
  private demoTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.routesApi.getAll(false).subscribe((r) => this.routes.set(r));
    this.busesApi.getAll().subscribe((b) => this.buses.set(b));
    this.tripsApi.mine().subscribe({
      next: (t) => {
        this.trip.set(t);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    inject(DestroyRef).onDestroy(() => this.stopAll());
  }

  startTrip(): void {
    const routeId = this.routeId();
    const busId = this.busId();
    if (routeId == null || busId == null) return;
    this.starting.set(true);
    this.error.set(null);
    this.tripsApi.start({ busId, routeId }).subscribe({
      next: (t) => {
        this.trip.set(t);
        this.starting.set(false);
        void this.hub.connect();
      },
      error: (err) => {
        this.error.set(err?.error?.detail ?? 'Could not start trip.');
        this.starting.set(false);
      },
    });
  }

  endTrip(): void {
    const t = this.trip();
    if (!t) return;
    this.stopAll();
    this.tripsApi.end(t.id).subscribe({
      next: () => this.trip.set(null),
      error: () => this.trip.set(null),
    });
  }

  toggleGps(): void {
    if (this.gpsOn()) {
      this.stopGps();
      return;
    }
    if (this.demoOn()) this.stopDemo();
    if (!('geolocation' in navigator)) {
      this.hint.set('This device has no geolocation. Try “Demo: drive the route” instead.');
      return;
    }
    const t = this.trip();
    if (!t) return;
    this.hint.set(null);
    this.geoWatchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, heading, speed } = pos.coords;
        const kmh = speed != null ? speed * 3.6 : 0;
        void this.send(t.id, latitude, longitude, heading ?? 0, kmh);
      },
      () => this.hint.set('Location permission denied. Try “Demo: drive the route” instead.'),
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 },
    );
    this.gpsOn.set(true);
  }

  toggleDemo(): void {
    if (this.demoOn()) {
      this.stopDemo();
      return;
    }
    if (this.gpsOn()) this.stopGps();
    const t = this.trip();
    if (!t) return;
    this.hint.set(null);
    this.routesApi.getById(t.routeId).subscribe((detail) => this.startDemo(t.id, detail.stops));
  }

  private startDemo(tripId: number, stops: RouteStop[]): void {
    const path = [...stops].sort((a, b) => a.sequence - b.sequence);
    if (path.length < 2) {
      this.hint.set('This route needs at least two stops to simulate a drive.');
      return;
    }
    let segment = 0;
    let step = 0;
    const stepsPerSegment = 6;
    this.demoOn.set(true);
    this.demoTimer = setInterval(() => {
      const a = path[segment];
      const b = path[(segment + 1) % path.length];
      const f = step / stepsPerSegment;
      const lat = a.latitude + (b.latitude - a.latitude) * f;
      const lng = a.longitude + (b.longitude - a.longitude) * f;
      void this.send(tripId, lat, lng, bearing(a.latitude, a.longitude, b.latitude, b.longitude), 28);
      step++;
      if (step > stepsPerSegment) {
        step = 0;
        segment = (segment + 1) % (path.length - 1);
      }
    }, 2000);
  }

  private async send(tripId: number, lat: number, lng: number, heading: number, speed: number): Promise<void> {
    try {
      await this.hub.sendLocation(tripId, lat, lng, heading, speed);
      this.lastPing.set({ lat, lng, speed, at: new Date() });
    } catch {
      this.hint.set('Lost connection to the server; retrying…');
    }
  }

  private stopGps(): void {
    if (this.geoWatchId != null) {
      navigator.geolocation.clearWatch(this.geoWatchId);
      this.geoWatchId = null;
    }
    this.gpsOn.set(false);
  }

  private stopDemo(): void {
    if (this.demoTimer != null) {
      clearInterval(this.demoTimer);
      this.demoTimer = null;
    }
    this.demoOn.set(false);
  }

  private stopAll(): void {
    this.stopGps();
    this.stopDemo();
    const t = this.trip();
    if (t) void this.hub.stopBroadcast(t.id);
  }
}
