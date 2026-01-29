/**
 * RouteX - Student Dashboard Component
 */

import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouteCardComponent, LoadingSpinnerComponent, EmptyStateComponent } from '../../../../shared/components';
import { AuthService } from '../../../../core/services';
import { Route, Bus } from '../../../../data/models';
import { MOCK_ROUTES, MOCK_BUSES } from '../../../../data/mock';

@Component({
    selector: 'rx-student-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouteCardComponent,
        LoadingSpinnerComponent,
        EmptyStateComponent
    ],
    templateUrl: './student-dashboard.component.html',
    styleUrl: './student-dashboard.component.scss'
})
export class StudentDashboardComponent implements OnInit {
    authService = inject(AuthService);
    private router = inject(Router);

    filter = signal<'all' | 'active' | 'favorites'>('all');
    routes = signal<Route[]>([]);
    buses = signal<Bus[]>([]);
    favorites = signal<string[]>([]);
    isLoading = signal(true);

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

    favoritesCount = computed(() => this.favorites().length);

    ngOnInit(): void {
        // Simulate loading
        setTimeout(() => {
            this.routes.set(MOCK_ROUTES);
            this.buses.set(MOCK_BUSES);

            const user = this.authService.user();
            if (user?.favoriteRouteIds) {
                this.favorites.set(user.favoriteRouteIds);
            }
            this.isLoading.set(false);
        }, 500);
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
