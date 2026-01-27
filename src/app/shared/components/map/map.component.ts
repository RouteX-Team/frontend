/**
 * RouteX - Shared Map Component
 * Powered by Leaflet.js
 */

import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, input, effect, PLATFORM_ID, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as L from 'leaflet';
import { GeoLocation, Route, Bus } from '../../../data/models';
import { ThemeService } from '../../../core/services';

@Component({
    selector: 'rx-map',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './map.component.html',
    styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit, OnDestroy {
    private platformId = inject(PLATFORM_ID);
    private themeService = inject(ThemeService);

    // Inputs
    center = input<GeoLocation>({ lat: 33.6844, lng: 73.0479 }); // University Main Gate
    zoom = input<number>(16);
    showOverlay = input<boolean>(false);
    routes = input<Route[]>([]);
    buses = input<Bus[]>([]);

    @ViewChild('mapContainer') mapContainer!: ElementRef;

    private map?: L.Map;
    private routeLayers: L.FeatureGroup = new L.FeatureGroup();
    private busMarkers: Map<string, L.Marker> = new Map();
    private isBrowser: boolean;

    constructor() {
        this.isBrowser = isPlatformBrowser(this.platformId);

        // React to theme changes
        effect(() => {
            const isDark = this.themeService.isDark();
            if (this.map) {
                this.updateTileLayer(isDark);
            }
        });

        // React to routes changes
        effect(() => {
            this.drawRoutes(this.routes());
        });

        // React to buses changes
        effect(() => {
            this.updateBusMarkers(this.buses());
        });
    }

    ngAfterViewInit(): void {
        if (this.isBrowser) {
            this.initMap();
        }
    }

    private resizeTimeout?: any;

    private initMap(): void {
        const { lat, lng } = this.center();

        this.map = L.map(this.mapContainer.nativeElement, {
            center: [lat, lng],
            zoom: this.zoom(),
            zoomControl: true,
            attributionControl: false
        });

        this.updateTileLayer(this.themeService.isDark());

        this.routeLayers.addTo(this.map);

        // Initial draw
        this.drawRoutes(this.routes());
        this.updateBusMarkers(this.buses());

        // Fix for Leaflet initialization in containers
        this.resizeTimeout = setTimeout(() => {
            if (this.map && this.mapContainer?.nativeElement) {
                this.map.invalidateSize();
            }
        }, 200);
    }

    private updateTileLayer(isDark: boolean): void {
        if (!this.map) return;

        // Remove existing tile layers
        this.map.eachLayer((layer) => {
            if (layer instanceof L.TileLayer) {
                this.map?.removeLayer(layer);
            }
        });

        // OpenStreetMap variant for light/dark
        // Using CartoDB Voyager (light) and Dark Matter (dark) - free for use
        const style = isDark ? 'dark_all' : 'voyager';
        const url = `https://{s}.basemaps.cartocdn.com/${style}/{z}/{x}/{y}{r}.png`;

        L.tileLayer(url, {
            maxZoom: 19
        }).addTo(this.map);
    }

    private drawRoutes(routes: Route[]): void {
        if (!this.map || !this.isBrowser) return;

        this.routeLayers.clearLayers();

        routes.forEach(route => {
            const points = route.stops.map(stop => [stop.location.lat, stop.location.lng] as L.LatLngExpression);

            // Draw path
            const polyline = L.polyline(points, {
                color: route.color,
                weight: 4,
                opacity: 0.6,
                dashArray: '10, 10'
            }).addTo(this.routeLayers);

            // Draw stops
            route.stops.forEach(stop => {
                const marker = L.circleMarker([stop.location.lat, stop.location.lng], {
                    radius: 5,
                    fillColor: route.color,
                    color: '#fff',
                    weight: 2,
                    fillOpacity: 1
                });

                marker.bindPopup(`<strong>${stop.name}</strong><br>Route: ${route.shortCode}`);
                marker.addTo(this.routeLayers);
            });
        });
    }

    private updateBusMarkers(buses: Bus[]): void {
        if (!this.map || !this.isBrowser) return;

        // Remove markers for buses that are no longer present
        const currentBusIds = new Set(buses.map(b => b.id));
        this.busMarkers.forEach((marker, id) => {
            if (!currentBusIds.has(id)) {
                marker.remove();
                this.busMarkers.delete(id);
            }
        });

        buses.forEach(bus => {
            if (!bus.currentLocation) return;

            const pos: L.LatLngExpression = [bus.currentLocation.lat, bus.currentLocation.lng];
            let marker = this.busMarkers.get(bus.id);

            if (!marker) {
                // Create new marker with custom bus icon
                const busIcon = L.divIcon({
                    className: 'bus-marker-icon',
                    html: `<div style="transform: rotate(${bus.heading || 0}deg); font-size: 24px;">🚌</div>`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                });

                marker = L.marker(pos, { icon: busIcon }).addTo(this.map!);
                this.busMarkers.set(bus.id, marker);
            } else {
                // Update existing marker
                marker.setLatLng(pos);

                // Update heading rotation
                const iconElement = marker.getElement();
                if (iconElement) {
                    const div = iconElement.querySelector('div');
                    if (div) {
                        div.style.transform = `rotate(${bus.heading || 0}deg)`;
                    }
                }
            }

            marker.bindPopup(`
        <div style="font-family: var(--rx-font-family)">
          <strong>${bus.name || bus.plateNumber}</strong><br>
          Status: ${bus.status}<br>
          Speed: ${bus.speed || 0} km/h
        </div>
      `);
        });
    }

    ngOnDestroy(): void {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        if (this.map) {
            this.map.remove();
            this.map = undefined;
        }
    }
}
