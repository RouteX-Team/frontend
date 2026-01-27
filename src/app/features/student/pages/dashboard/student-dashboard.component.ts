/**
 * RouteX - Student Dashboard Component
 */

import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouteCardComponent, MapComponent } from '../../../../shared/components';
import { AuthService, TrackingService } from '../../../../core/services';
import { Route, Bus, GeoLocation } from '../../../../data/models';
import { MOCK_ROUTES, MOCK_BUSES } from '../../../../data/mock';

@Component({
    selector: 'rx-student-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, RouteCardComponent, MapComponent],
    templateUrl: './student-dashboard.component.html',
    styleUrl: './student-dashboard.component.scss'
})
export class StudentDashboardComponent implements OnInit {
    authService = inject(AuthService);
    trackingService = inject(TrackingService);
    private router = inject(Router);

    filter = signal<'all' | 'active' | 'favorites'>('all');
    routes = signal<Route[]>([]);
    buses = signal<Bus[]>([]);
    favorites = signal<string[]>([]);
    mapCenter = signal<GeoLocation>({ lat: 33.6844, lng: 73.0479 });

    // Compute active buses from tracking service
    activeBuses = computed(() => {
        const locations = this.trackingService.allBusLocations();
        return this.buses().map(bus => {
            const livePos = locations.get(bus.id);
            if (livePos) {
                return { ...bus, currentLocation: livePos, status: 'on-route' as any };
            }
            return bus;
        }).filter(b => b.currentLocation);
    });

    filteredRoutes = computed(() => {
        const allRoutes = this.routes();
        const filterType = this.filter();
        const favs = this.favorites();

        switch (filterType) {
            case 'active':
                return allRoutes.filter(r => r.isActive);
            case 'favorites':
                return allRoutes.filter(r => favs.includes(r.id));
            default:
                return allRoutes;
        }
    });

    ngOnInit(): void {
        // Load mock data
        this.routes.set(MOCK_ROUTES);
        this.buses.set(MOCK_BUSES);

        // Initialize live locations
        this.trackingService.initializeBusLocations();

        const user = this.authService.user();
        if (user?.favoriteRouteIds) {
            this.favorites.set(user.favoriteRouteIds);
        }
    }

    getBusForRoute(routeId: string): Bus | null {
        return this.buses().find(b => b.currentRouteId === routeId) ?? null;
    }

    isFavorite(routeId: string): boolean {
        return this.favorites().includes(routeId);
    }

    onFavoriteToggle(routeId: string): void {
        this.favorites.update(favs => {
            if (favs.includes(routeId)) {
                return favs.filter(id => id !== routeId);
            } else {
                return [...favs, routeId];
            }
        });

        this.authService.updateUser({ favoriteRouteIds: this.favorites() });
    }

    onRouteClick(route: Route): void {
        this.router.navigate(['/student/route', route.id]);
    }
}
