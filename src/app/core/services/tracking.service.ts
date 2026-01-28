/**
 * RouteX - Tracking Service
 * Handles GPS simulation and real-time bus location updates
 * Designed to be replaceable with WebSocket backend later
 */

import { Injectable, signal, computed, inject, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { GeoLocation } from '../../data/models';
import { MOCK_BUSES, getBusById } from '../../data/mock';
import { MOCK_ROUTES, getRouteById } from '../../data/mock';

export interface TrackingState {
    isActive: boolean;
    routeId: string | null;
    busId: string | null;
    currentLocation: GeoLocation | null;
    heading: number;
    speed: number;
    nextStopId: string | null;
    lastUpdated: Date | null;
}

@Injectable({ providedIn: 'root' })
export class TrackingService implements OnDestroy {

    // Simulation interval (3 seconds)
    private readonly UPDATE_INTERVAL = 3000;
    private simulationSubscription: Subscription | null = null;
    private currentStopIndex = 0;

    // Internal state
    private trackingState = signal<TrackingState>({
        isActive: false,
        routeId: null,
        busId: null,
        currentLocation: null,
        heading: 0,
        speed: 0,
        nextStopId: null,
        lastUpdated: null
    });

    // Public readonly signals
    readonly state = this.trackingState.asReadonly();
    readonly isTracking = computed(() => this.trackingState().isActive);
    readonly currentLocation = computed(() => this.trackingState().currentLocation);
    readonly speed = computed(() => this.trackingState().speed);
    readonly heading = computed(() => this.trackingState().heading);

    // Bus locations for student view (all active buses)
    private busLocations = signal<Map<string, GeoLocation>>(new Map());
    readonly allBusLocations = this.busLocations.asReadonly();

    // Bus headings for map display
    private _busHeadings = signal<Map<string, number>>(new Map());
    readonly busHeadings = this._busHeadings.asReadonly();

    /**
     * Start tracking for a driver on a specific route
     */
    startTracking(routeId: string, busId: string): boolean {
        const route = getRouteById(routeId);
        const bus = getBusById(busId);

        if (!route || !bus) {
            console.error('Invalid route or bus ID');
            return false;
        }

        // Initialize with first stop location
        const firstStop = route.stops[0];
        this.currentStopIndex = 0;

        this.trackingState.update(state => ({
            ...state,
            isActive: true,
            routeId,
            busId,
            currentLocation: firstStop.location,
            nextStopId: route.stops[1]?.id ?? null,
            lastUpdated: new Date()
        }));

        // Start simulation interval
        this.simulationSubscription = interval(this.UPDATE_INTERVAL).subscribe(() => {
            this.simulateMovement(route);
        });

        return true;
    }

    /**
     * Stop tracking
     */
    stopTracking(): void {
        if (this.simulationSubscription) {
            this.simulationSubscription.unsubscribe();
            this.simulationSubscription = null;
        }

        this.trackingState.update(state => ({
            ...state,
            isActive: false,
            speed: 0,
            lastUpdated: new Date()
        }));
    }

    /**
     * Get ETA to a specific stop
     */
    getETAToStop(stopId: string): number | null {
        const state = this.trackingState();
        if (!state.isActive || !state.routeId) return null;

        const route = getRouteById(state.routeId);
        if (!route) return null;

        const currentIdx = this.currentStopIndex;
        const targetIdx = route.stops.findIndex(s => s.id === stopId);

        if (targetIdx <= currentIdx) return null;

        // Rough estimate: 2 minutes per stop
        return (targetIdx - currentIdx) * 2;
    }

    /**
     * Simulate bus movement between stops
     */
    private simulateMovement(route: typeof MOCK_ROUTES[0]): void {
        const stops = route.stops;

        // Move to next stop
        this.currentStopIndex++;
        if (this.currentStopIndex >= stops.length) {
            this.currentStopIndex = 0; // Loop back to start
        }

        const currentStop = stops[this.currentStopIndex];
        const nextStop = stops[(this.currentStopIndex + 1) % stops.length];

        // Calculate heading
        const heading = this.calculateHeading(
            currentStop.location,
            nextStop.location
        );

        // Random speed between 15-35 km/h
        const speed = Math.floor(Math.random() * 20) + 15;

        this.trackingState.update(state => ({
            ...state,
            currentLocation: currentStop.location,
            heading,
            speed,
            nextStopId: nextStop.id,
            lastUpdated: new Date()
        }));

        // Update global bus locations map
        const busId = this.trackingState().busId;
        if (busId) {
            this.busLocations.update(map => {
                const newMap = new Map(map);
                newMap.set(busId, currentStop.location);
                return newMap;
            });

            this._busHeadings.update(map => {
                const newMap = new Map(map);
                newMap.set(busId, heading);
                return newMap;
            });
        }
    }

    /**
     * Calculate heading between two points
     */
    private calculateHeading(from: GeoLocation, to: GeoLocation): number {
        const dLon = (to.lng - from.lng) * Math.PI / 180;
        const lat1 = from.lat * Math.PI / 180;
        const lat2 = to.lat * Math.PI / 180;

        const y = Math.sin(dLon) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

        let heading = Math.atan2(y, x) * 180 / Math.PI;
        return (heading + 360) % 360;
    }

    /**
     * Initialize mock bus locations for student view
     */
    initializeBusLocations(): void {
        const locations = new Map<string, GeoLocation>();

        MOCK_BUSES.forEach(bus => {
            if (bus.currentLocation && bus.status !== 'offline' && bus.status !== 'maintenance') {
                locations.set(bus.id, bus.currentLocation);
            }
        });

        this.busLocations.set(locations);
    }

    /**
     * Simulate movement for all buses (for student view)
     * This randomly updates bus positions to simulate real-time tracking
     */
    simulateAllBusMovement(): void {
        const currentLocations = this.busLocations();
        const newLocations = new Map<string, GeoLocation>();
        const newHeadings = new Map<string, number>();

        MOCK_BUSES.forEach(bus => {
            if (bus.currentRouteId && bus.status !== 'offline' && bus.status !== 'maintenance') {
                const route = getRouteById(bus.currentRouteId);
                if (route && route.stops.length > 0) {
                    // Pick a random stop location for simulation
                    const randomIndex = Math.floor(Math.random() * route.stops.length);
                    const stop = route.stops[randomIndex];

                    // Add slight random variation
                    const lat = stop.location.lat + (Math.random() - 0.5) * 0.001;
                    const lng = stop.location.lng + (Math.random() - 0.5) * 0.001;

                    newLocations.set(bus.id, { lat, lng });

                    // Calculate heading to next stop
                    const nextIndex = (randomIndex + 1) % route.stops.length;
                    const nextStop = route.stops[nextIndex];
                    const heading = this.calculateHeading(stop.location, nextStop.location);
                    newHeadings.set(bus.id, heading);
                }
            }
        });

        this.busLocations.set(newLocations);
        this._busHeadings.set(newHeadings);
    }

    ngOnDestroy(): void {
        this.stopTracking();
    }
}
