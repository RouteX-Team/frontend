/**
 * RouteX - Driver Tracking Component
 */

import { Component, inject, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, TrackingService } from '../../../../core/services';
import { StatusBadgeComponent, MapComponent } from '../../../../shared/components';
import { getRouteById } from '../../../../data/mock';
import { Route, BusStatus, GeoLocation } from '../../../../data/models';

@Component({
    selector: 'rx-driver-tracking',
    standalone: true,
    imports: [CommonModule, StatusBadgeComponent, MapComponent],
    templateUrl: './driver-tracking.component.html',
    styleUrl: './driver-tracking.component.scss'
})
export class DriverTrackingComponent implements OnDestroy {
    authService = inject(AuthService);
    trackingService = inject(TrackingService);

    mapCenter = signal<GeoLocation>({ lat: 33.6844, lng: 73.0479 });

    // Computed for map view
    activeBusesForMap = computed(() => {
        const state = this.trackingService.state();
        if (!state.isActive || !state.currentLocation || !state.busId) return [];

        return [{
            id: state.busId,
            plateNumber: 'Current Bus',
            status: 'on-route' as any,
            currentLocation: state.currentLocation,
            heading: state.heading,
            capacity: 0
        }];
    });

    activeRoutesForMap = computed(() => {
        const route = this.assignedRoute();
        return route ? [route] : [];
    });

    currentStatus = computed<BusStatus>(() => {
        if (this.trackingService.isTracking()) {
            return 'on-route';
        }
        return 'idle';
    });

    assignedRoute = computed<Route | null>(() => {
        const user = this.authService.user();
        if (!user?.assignedRouteId) return null;
        return getRouteById(user.assignedRouteId) ?? null;
    });

    progressPercent = signal(0);

    lastUpdated = computed(() => {
        const state = this.trackingService.state();
        if (!state.lastUpdated) return 'Never';

        const seconds = Math.floor((Date.now() - state.lastUpdated.getTime()) / 1000);
        if (seconds < 5) return 'Just now';
        if (seconds < 60) return `${seconds}s ago`;
        return `${Math.floor(seconds / 60)}m ago`;
    });

    nextStop = computed(() => {
        const state = this.trackingService.state();
        const route = this.assignedRoute();
        if (!state.nextStopId || !route) return null;

        const stop = route.stops.find(s => s.id === state.nextStopId);
        return stop?.name ?? null;
    });

    startTracking(): void {
        const user = this.authService.user();
        if (!user?.assignedRouteId || !user?.assignedBusId) return;

        this.trackingService.startTracking(user.assignedRouteId, user.assignedBusId);
        this.simulateProgress();
    }

    stopTracking(): void {
        this.trackingService.stopTracking();
        this.progressPercent.set(0);
    }

    private simulateProgress(): void {
        const interval = setInterval(() => {
            if (!this.trackingService.isTracking()) {
                clearInterval(interval);
                return;
            }

            this.progressPercent.update(p => {
                const newP = p + Math.random() * 10;
                return newP > 100 ? 0 : newP;
            });
        }, 3000);
    }

    ngOnDestroy(): void {
        this.trackingService.stopTracking();
    }
}
