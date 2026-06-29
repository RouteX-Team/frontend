import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { RouteStop } from '../models/route.model';

export interface LiveBusMarker {
  id: number;
  label: string;
  latitude: number;
  longitude: number;
  heading?: number;
  stale?: boolean;
}

@Component({
  selector: 'app-route-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div #map class="routex-map" role="application" aria-label="Route map"></div>`,
})
export class RouteMap {
  /** Ordered stops to draw as a connected path. */
  readonly stops = input<RouteStop[]>([]);
  /** Optional live bus positions (used by the tracking views). */
  readonly buses = input<LiveBusMarker[]>([]);
  /** When true, the map re-fits its bounds whenever stops change. */
  readonly autoFit = input(true);

  private readonly mapEl = viewChild.required<ElementRef<HTMLDivElement>>('map');
  private map?: L.Map;
  private readonly stopLayer = L.layerGroup();
  private readonly busLayer = L.layerGroup();
  private routeLine?: L.Polyline;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const map = L.map(this.mapEl().nativeElement, {
        zoomControl: true,
        attributionControl: true,
      }).setView([33.656, 73.097], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      this.stopLayer.addTo(map);
      this.busLayer.addTo(map);
      this.map = map;
      this.renderStops();
      this.renderBuses();
    });

    effect(() => {
      this.stops();
      if (this.map) this.renderStops();
    });

    effect(() => {
      this.buses();
      if (this.map) this.renderBuses();
    });

    destroyRef.onDestroy(() => {
      this.map?.remove();
      this.map = undefined;
    });
  }

  private renderStops(): void {
    this.stopLayer.clearLayers();
    this.routeLine?.remove();

    const stops = this.stops();
    if (stops.length === 0) return;

    const latlngs = stops.map((s) => [s.latitude, s.longitude] as L.LatLngTuple);

    this.routeLine = L.polyline(latlngs, {
      color: '#0284c7',
      weight: 4,
      opacity: 0.7,
    }).addTo(this.stopLayer);

    stops.forEach((s, i) => {
      const isEndpoint = i === 0 || i === stops.length - 1;
      L.circleMarker([s.latitude, s.longitude], {
        radius: isEndpoint ? 9 : 7,
        color: '#ffffff',
        weight: 2,
        fillColor: i === 0 ? '#16a34a' : i === stops.length - 1 ? '#dc2626' : '#0284c7',
        fillOpacity: 1,
      })
        .bindTooltip(`${s.sequence}. ${s.stopName}`, { direction: 'top' })
        .addTo(this.stopLayer);
    });

    if (this.autoFit()) {
      this.map?.fitBounds(L.latLngBounds(latlngs).pad(0.2));
    }
  }

  private renderBuses(): void {
    this.busLayer.clearLayers();
    for (const bus of this.buses()) {
      const icon = L.divIcon({
        className: 'routex-bus-marker',
        html: `<div class="routex-bus-dot ${bus.stale ? 'is-stale' : ''}" style="transform: rotate(${bus.heading ?? 0}deg)">🚌</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      L.marker([bus.latitude, bus.longitude], { icon })
        .bindTooltip(bus.label, { direction: 'top', offset: [0, -10] })
        .addTo(this.busLayer);
    }
  }
}
