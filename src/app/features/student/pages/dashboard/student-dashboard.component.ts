/**
 * RouteX - Student Dashboard Component
 */

import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouteCardComponent, MapComponent, LoadingSpinnerComponent, EmptyStateComponent, BottomNavComponent, NavItem } from '../../../../shared/components';
import { AuthService, TrackingService } from '../../../../core/services';
import { Route, Bus, GeoLocation } from '../../../../data/models';
import { MOCK_ROUTES, MOCK_BUSES } from '../../../../data/mock';
import { interval, Subscription } from 'rxjs';

@Component({
    selector: 'rx-student-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouteCardComponent,
        MapComponent,
        LoadingSpinnerComponent,
        EmptyStateComponent,
        BottomNavComponent
    ],
    templateUrl: './student-dashboard.component.html',
    styleUrl: './student-dashboard.component.scss'
})
export class StudentDashboardComponent implements OnInit, OnDestroy {
    authService = inject(AuthService);
    trackingService = inject(TrackingService);
    private router = inject(Router);

    filter = signal<'all' | 'active' | 'favorites'>('all');
    routes = signal<Route[]>([]);
    buses = signal<Bus[]>([]);
    favorites = signal<string[]>([]);
    mapCenter = signal<GeoLocation>({ lat: 33.6844, lng: 73.0479 });
    isLoading = signal(true);
    activeNavItem = signal('home');

    private updateSubscription: Subscription | null = null;

    // Navigation items
    navItems: NavItem[] = [
        { id: 'home', label: 'Home', icon: 'pi-home' },
        { id: 'map', label: 'Map', icon: 'pi-map' },
        { id: 'favorites', label: 'Favorites', icon: 'pi-star' },
        { id: 'logout', label: 'Logout', icon: 'pi-sign-out' }
    ];

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

    // Stats
    activeRoutesCount = computed(() => this.routes().filter(r => r.isActive).length);
    activeBusesCount = computed(() => this.activeBuses().length);
    favoritesCount = computed(() => this.favorites().length);

    ngOnInit(): void {
        // Simulate loading
        setTimeout(() => {
            this.routes.set(MOCK_ROUTES);
            this.buses.set(MOCK_BUSES);
            this.trackingService.initializeBusLocations();

            const user = this.authService.user();
            if (user?.favoriteRouteIds) {
                this.favorites.set(user.favoriteRouteIds);
            }
            this.isLoading.set(false);
        }, 500);

        // Auto-refresh bus locations every 5 seconds
        this.updateSubscription = interval(5000).subscribe(() => {
            this.trackingService.simulateAllBusMovement();
        });
    }

    ngOnDestroy(): void {
        this.updateSubscription?.unsubscribe();
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

    onNavClick(item: NavItem): void {
        this.activeNavItem.set(item.id);

        switch (item.id) {
            case 'home':
                this.filter.set('all');
                break;
            case 'favorites':
                this.filter.set('favorites');
                break;
            case 'logout':
                this.authService.logout();
                break;
        }
    }
}
