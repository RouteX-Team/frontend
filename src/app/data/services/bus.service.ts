/**
 * RouteX - Bus Service
 * Manages bus inventory and status
 */

import { Injectable, signal, computed } from '@angular/core';
import { Bus, BusStatus } from '../models/bus.model';
import { MOCK_BUSES } from '../mock/buses.data';

@Injectable({
    providedIn: 'root'
})
export class BusService {
    private busesState = signal<Bus[]>(MOCK_BUSES);

    readonly buses = this.busesState.asReadonly();
    readonly onlineBuses = computed(() =>
        this.busesState().filter(b => b.status !== 'offline' && b.status !== 'maintenance')
    );

    /**
     * Get bus by ID
     */
    getBus(id: string): Bus | undefined {
        return this.busesState().find(b => b.id === id);
    }

    /**
     * Update bus status or location
     */
    updateBus(id: string, updates: Partial<Bus>): void {
        this.busesState.update(buses =>
            buses.map(b => b.id === id ? { ...b, ...updates } : b)
        );
    }

    /**
     * Assign bus to route
     */
    assignToRoute(busId: string, routeId: string | undefined): void {
        this.updateBus(busId, { currentRouteId: routeId });
    }
}
