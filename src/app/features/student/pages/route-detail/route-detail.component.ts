/**
 * RouteX - Student Route Detail Component
 * Displays specific route path, stops, and live bus location
 */

import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MapComponent, StatusBadgeComponent } from '../../../../shared/components';
import { TrackingService, AuthService } from '../../../../core/services';
import { Route, Bus, GeoLocation, Stop } from '../../../../data/models';
import { MOCK_ROUTES, MOCK_BUSES } from '../../../../data/mock';

@Component({
    selector: 'rx-route-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, MapComponent, StatusBadgeComponent],
    templateUrl: './route-detail.component.html',
    styleUrl: './route-detail.component.scss'
})
export class RouteDetailComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private trackingService = inject(TrackingService);
    private authService = inject(AuthService);

    routeId = signal<string | null>(null);
    currentRoute = signal<Route | null>(null);
    buses = signal<Bus[]>([]);
    favorites = signal<string[]>([]);

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

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.routeId.set(id);

        if (id) {
            const foundRoute = MOCK_ROUTES.find(r => r.id === id);
            if (foundRoute) {
                this.currentRoute.set(foundRoute);
            } else {
                this.router.navigate(['/student']);
            }
        }

        // Load buses and favorites
        this.buses.set(MOCK_BUSES);
        const user = this.authService.user();
        if (user?.favoriteRouteIds) {
            this.favorites.set(user.favoriteRouteIds);
        }

        // Ensure tracking is initialized
        this.trackingService.initializeBusLocations();
    }

    ngOnDestroy(): void {
        // Cleanup if needed
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

    getDistance(index: number): string {
        // Mock distance calculation based on index to be deterministic
        const baseDistance = 1.2;
        const incrementalDistance = 0.5;
        return (baseDistance + (index * incrementalDistance)).toFixed(1) + ' km';
    }

    getTimeToStop(order: number): string {
        // Mock time calculation based on order
        const baseTime = 3;
        return (order * baseTime) + ' min';
    }
}
