/**
 * RouteX - Admin Dashboard Component
 */

import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatusBadgeComponent, MapComponent } from '../../../../shared/components';
import { AuthService, TrackingService } from '../../../../core/services';
import { RouteService, BusService, UserService } from '../../../../data/services';
import { Route, Bus, BusStatus, User, GeoLocation } from '../../../../data/models';

interface StatCard {
    icon: string;
    label: string;
    value: number | string;
    color: string;
}

@Component({
    selector: 'rx-admin-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, StatusBadgeComponent, MapComponent],
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
    authService = inject(AuthService);
    trackingService = inject(TrackingService);
    routeService = inject(RouteService);
    busService = inject(BusService);
    userService = inject(UserService);

    routes = this.routeService.routes;
    buses = this.busService.onlineBuses;
    users = this.userService.users;
    mapCenter = signal<GeoLocation>({ lat: 33.6844, lng: 73.0479 });

    // Compute active buses from tracking service
    activeBuses = computed(() => {
        const locations = this.trackingService.allBusLocations();
        const allBuses = this.busService.buses();
        return allBuses.map((bus: Bus) => {
            const livePos = locations.get(bus.id);
            if (livePos) {
                return { ...bus, currentLocation: livePos, status: 'on-route' as BusStatus };
            }
            return bus;
        }).filter((b: Bus) => b.currentLocation);
    });

    stats = computed<StatCard[]>(() => [
        {
            icon: 'pi-map',
            label: 'Active Routes',
            value: this.routes().filter((r: Route) => r.isActive).length,
            color: 'var(--rx-primary-100)'
        },
        {
            icon: 'pi-truck',
            label: 'Buses Online',
            value: this.buses().length,
            color: 'var(--rx-success-100)'
        },
        {
            icon: 'pi-exclamation-triangle',
            label: 'Delayed',
            value: this.busService.buses().filter((b: Bus) => b.status === 'delayed').length,
            color: 'var(--rx-warning-100)'
        },
        {
            icon: 'pi-users',
            label: 'Total Users',
            value: this.users().length,
            color: 'var(--rx-info-100)'
        }
    ]);

    activeRoutes = computed(() => this.routes().filter((r: Route) => r.isActive));

    recentActivity = [
        { icon: 'pi-play-circle', type: 'success', message: 'Bus R1 started tracking on Main Campus Loop', time: '5 min ago' },
        { icon: 'pi-exclamation-triangle', type: 'warning', message: 'Route 3 marked as delayed due to traffic', time: '12 min ago' },
        { icon: 'pi-user-plus', type: 'info', message: 'New student registered: fatima.khan@student.edu', time: '1 hour ago' },
        { icon: 'pi-check-circle', type: 'success', message: 'Driver Imran assigned to Hostel Express', time: '2 hours ago' }
    ];

    ngOnInit(): void {
        // Initialize live locations
        this.trackingService.initializeBusLocations();
    }
}
