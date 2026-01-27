/**
 * RouteX - Route Service
 * Manages bus routes and related operations
 */

import { Injectable, signal, computed } from '@angular/core';
import { Route, Stop } from '../models/route.model';
import { MOCK_ROUTES } from '../mock/routes.data';

@Injectable({
    providedIn: 'root'
})
export class RouteService {
    private routesState = signal<Route[]>(MOCK_ROUTES);

    readonly routes = this.routesState.asReadonly();
    readonly activeRoutes = computed(() => this.routesState().filter(r => r.isActive));

    /**
     * Get route by ID
     */
    getRoute(id: string): Route | undefined {
        return this.routesState().find(r => r.id === id);
    }

    /**
     * Add new route
     */
    addRoute(route: Omit<Route, 'id'>): void {
        const newRoute: Route = {
            ...route,
            id: `route-${Date.now()}`
        };
        this.routesState.update(routes => [...routes, newRoute]);
    }

    /**
     * Update existing route
     */
    updateRoute(id: string, updates: Partial<Route>): void {
        this.routesState.update(routes =>
            routes.map(r => r.id === id ? { ...r, ...updates } : r)
        );
    }

    /**
     * Delete route
     */
    deleteRoute(id: string): void {
        this.routesState.update(routes => routes.filter(r => r.id !== id));
    }

    /**
     * Toggle route status
     */
    toggleRouteStatus(id: string): void {
        const route = this.getRoute(id);
        if (route) {
            this.updateRoute(id, { isActive: !route.isActive });
        }
    }
}
