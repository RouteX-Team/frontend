/**
 * RouteX - Driver Tracking Component
 */

import { Component, inject, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, TrackingService } from '../../../../core/services';
import {
    StatusBadgeComponent,
    MapComponent
} from '../../../../shared/components';
import { EtaPipe, DurationPipe, TimeAgoPipe } from '../../../../shared/pipes';
import { getRouteById } from '../../../../data/mock';
import { Route, BusStatus, GeoLocation, Stop } from '../../../../data/models';

@Component({
    selector: 'rx-driver-tracking',
    standalone: true,
    imports: [
        CommonModule,
        StatusBadgeComponent,
        MapComponent,
        EtaPipe,
        DurationPipe,
        TimeAgoPipe
    ],
    templateUrl: './driver-tracking.component.html',
    styleUrl: './driver-tracking.component.scss'
})
export class DriverTrackingComponent implements OnDestroy {
    authService = inject(AuthService);
    trackingService = inject(TrackingService);

    mapCenter = signal<GeoLocation>({ lat: 33.6844, lng: 73.0479 });
    elapsedMinutes = signal(0);
    private elapsedInterval: ReturnType<typeof setInterval> | null = null;

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

    // Computed: current stop index
    currentStopIndex = computed(() => {
        const route = this.assignedRoute();
        const state = this.trackingService.state();
        if (!route || !state.nextStopId) return 0;

        const nextIndex = route.stops.findIndex(s => s.id === state.nextStopId);
        return nextIndex > 0 ? nextIndex - 1 : 0;
    });

    // Computed: stops with progress info
    stopsWithProgress = computed(() => {
        const route = this.assignedRoute();
        if (!route) return [];

        const currentIdx = this.currentStopIndex();
        return route.stops.map((stop, index) => ({
            ...stop,
            isPassed: index < currentIdx,
            isCurrent: index === currentIdx,
            isNext: index === currentIdx + 1,
            etaMinutes: (index - currentIdx) * 2
        }));
    });

    // Computed: completed stops count
    completedStops = computed(() => {
        return this.stopsWithProgress().filter(s => s.isPassed).length;
    });

    // Computed: remaining time estimate
    remainingMinutes = computed(() => {
        const route = this.assignedRoute();
        if (!route) return 0;
        const remaining = route.stops.length - this.currentStopIndex() - 1;
        return remaining * 2; // 2 minutes per stop
    });

    lastUpdated = computed(() => {
        const state = this.trackingService.state();
        return state.lastUpdated;
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

        // Start elapsed time counter
        this.elapsedMinutes.set(0);
        this.elapsedInterval = setInterval(() => {
            this.elapsedMinutes.update(m => m + 1);
        }, 60000);
    }

    stopTracking(): void {
        this.trackingService.stopTracking();
        this.progressPercent.set(0);
        this.elapsedMinutes.set(0);

        if (this.elapsedInterval) {
            clearInterval(this.elapsedInterval);
            this.elapsedInterval = null;
        }
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
        if (this.elapsedInterval) {
            clearInterval(this.elapsedInterval);
        }
    }
}
