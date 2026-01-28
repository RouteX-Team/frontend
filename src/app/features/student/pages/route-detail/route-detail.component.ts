/**
 * RouteX - Student Route Detail Component
 * Displays specific route path, stops, and live bus location
 */

import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
    MapComponent,
    StatusBadgeComponent,
    LoadingSpinnerComponent,
    BusMarkerComponent
} from '../../../../shared/components';
import { EtaPipe, DistancePipe, TimeAgoPipe } from '../../../../shared/pipes';
import { TrackingService, AuthService } from '../../../../core/services';
import { Route, Bus, GeoLocation, Stop } from '../../../../data/models';
import { MOCK_ROUTES, MOCK_BUSES } from '../../../../data/mock';

@Component({
    selector: 'rx-route-detail',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MapComponent,
        StatusBadgeComponent,
        LoadingSpinnerComponent,
        BusMarkerComponent,
        EtaPipe,
        DistancePipe,
        TimeAgoPipe
    ],
    templateUrl: './route-detail.component.html',
    styleUrl: './route-detail.component.scss'
})
export class RouteDetailComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private trackingService = inject(TrackingService);
    private authService = inject(AuthService);
    private refreshInterval: ReturnType<typeof setInterval> | null = null;

    routeId = signal<string | null>(null);
    currentRoute = signal<Route | null>(null);
    buses = signal<Bus[]>([]);
    favorites = signal<string[]>([]);
    loading = signal(true);
    lastUpdated = signal<Date>(new Date());

    // Compute the bus assigned to this route with live location
    activeBus = computed(() => {
        const id = this.routeId();
        if (!id) return null;

        const bus = this.buses().find(b => b.currentRouteId === id);
        if (!bus) return null;

        const livePos = this.trackingService.allBusLocations().get(bus.id);
        if (livePos) {
            return { ...bus, currentLocation: livePos, status: 'on-route' as any };
        }
        return bus;
    });

    // Get heading for bus marker
    busHeading = computed(() => {
        const bus = this.activeBus();
        if (!bus) return 0;
        return this.trackingService.busHeadings().get(bus.id) ?? 0;
    });

    // Determine map center and markers
    mapCenter = computed<GeoLocation>(() => {
        const route = this.currentRoute();
        if (route && route.stops.length > 0) {
            return route.stops[0].location;
        }
        return { lat: 33.6844, lng: 73.0479 };
    });

    isFavorite = computed(() => {
        const id = this.routeId();
        return id ? this.favorites().includes(id) : false;
    });

    // Prepare stops with pre-calculated distance and ETA (now in meters/minutes for pipes)
    stopsWithStats = computed(() => {
        const route = this.currentRoute();
        if (!route) return [];

        return route.stops.map((stop, index) => {
            const baseDistance = 1200; // meters
            const incrementalDistance = 500;
            const distanceMeters = baseDistance + (index * incrementalDistance);

            const baseTime = 3;
            const etaMinutes = index * baseTime;

            // Determine if bus has passed this stop
            const bus = this.activeBus();
            let busProgress = 0;
            if (bus) {
                // Simple progress calculation based on time
                busProgress = Math.floor((Date.now() / 1000) % route.stops.length);
            }

            return {
                ...stop,
                distanceMeters,
                etaMinutes,
                isPassed: index < busProgress,
                isNext: index === busProgress
            };
        });
    });

    // Count completed stops
    completedStops = computed(() => {
        return this.stopsWithStats().filter(s => s.isPassed).length;
    });

    // Progress percentage
    progressPercent = computed(() => {
        const stops = this.stopsWithStats();
        if (stops.length === 0) return 0;
        return Math.round((this.completedStops() / stops.length) * 100);
    });

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.routeId.set(id);

        if (id) {
            // Simulate loading
            setTimeout(() => {
                const foundRoute = MOCK_ROUTES.find(r => r.id === id);
                if (foundRoute) {
                    this.currentRoute.set(foundRoute);
                } else {
                    this.router.navigate(['/student']);
                }
                this.loading.set(false);
            }, 500);
        } else {
            this.loading.set(false);
        }

        // Load buses and favorites
        this.buses.set(MOCK_BUSES);
        const user = this.authService.user();
        if (user?.favoriteRouteIds) {
            this.favorites.set(user.favoriteRouteIds);
        }

        // Ensure tracking is initialized
        this.trackingService.initializeBusLocations();

        // Auto-refresh every 10 seconds
        this.refreshInterval = setInterval(() => {
            this.lastUpdated.set(new Date());
        }, 10000);
    }

    ngOnDestroy(): void {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }

    toggleFavorite(): void {
        const id = this.routeId();
        if (!id) return;

        this.favorites.update(favs => {
            if (favs.includes(id)) {
                return favs.filter(f => f !== id);
            } else {
                return [...favs, id];
            }
        });

        this.authService.updateUser({ favoriteRouteIds: this.favorites() });
    }

    goBack(): void {
        this.router.navigate(['/student']);
    }
}
