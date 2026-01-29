/**
 * RouteX - Assignment Form Component
 * Assign driver and bus to a route on a separate page
 */

import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { RouteService } from '../../../../../data/services/route.service';
import { UserService } from '../../../../../data/services/user.service';
import { BusService } from '../../../../../data/services/bus.service';
import { Route, User, Bus } from '../../../../../data/models';

@Component({
    selector: 'rx-assignment-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        SelectModule,
        ToastModule,
        CardModule
    ],
    providers: [MessageService],
    templateUrl: './assignment-form.component.html',
    styleUrl: './assignment-form.component.scss'
})
export class AssignmentFormComponent implements OnInit {
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private routeService = inject(RouteService);
    private userService = inject(UserService);
    private busService = inject(BusService);
    private messageService = inject(MessageService);

    isEditMode = signal(false);
    routeId = signal<string | null>(null);
    loading = signal(false);

    currentRoute = signal<Route | null>(null);
    selectedDriverId = signal<string | null>(null);
    selectedBusId = signal<string | null>(null);

    routes = this.routeService.routes;
    drivers = this.userService.drivers;
    buses = this.busService.buses;

    // Available (unassigned) resources
    availableDrivers = computed(() => {
        const currentRouteId = this.routeId();
        return this.drivers().filter(d =>
            !d.assignedRouteId || d.assignedRouteId === currentRouteId
        );
    });

    availableBuses = computed(() => {
        const currentRouteId = this.routeId();
        return this.buses().filter(b =>
            !b.currentRouteId || b.currentRouteId === currentRouteId
        );
    });

    ngOnInit(): void {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        if (id && id !== 'new') {
            this.isEditMode.set(true);
            this.routeId.set(id);
            this.loadAssignment(id);
        }
    }

    loadAssignment(routeId: string): void {
        const route = this.routeService.getRoute(routeId);
        if (route) {
            this.currentRoute.set(route);

            // Find current assignments
            const currentDriver = this.drivers().find(d => d.assignedRouteId === routeId);
            const currentBus = this.buses().find(b => b.currentRouteId === routeId);

            this.selectedDriverId.set(currentDriver?.id || null);
            this.selectedBusId.set(currentBus?.id || null);
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Route not found'
            });
            this.router.navigate(['/admin/assignments']);
        }
    }

    onRouteChange(routeId: string): void {
        this.routeId.set(routeId);
        const route = this.routeService.getRoute(routeId);
        this.currentRoute.set(route || null);

        if (route) {
            const currentDriver = this.drivers().find(d => d.assignedRouteId === routeId);
            const currentBus = this.buses().find(b => b.currentRouteId === routeId);
            this.selectedDriverId.set(currentDriver?.id || null);
            this.selectedBusId.set(currentBus?.id || null);
        }
    }

    onSubmit(): void {
        const route = this.currentRoute();
        if (!route) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Please select a route'
            });
            return;
        }

        this.loading.set(true);

        const newDriverId = this.selectedDriverId();
        const newBusId = this.selectedBusId();

        // Update driver assignment
        const currentDriver = this.drivers().find(d => d.assignedRouteId === route.id);
        if (currentDriver && currentDriver.id !== newDriverId) {
            this.userService.updateUser(currentDriver.id, { assignedRouteId: undefined });
        }

        if (newDriverId) {
            this.userService.updateUser(newDriverId, { assignedRouteId: route.id });
        }

        // Update bus assignment
        const currentBus = this.buses().find(b => b.currentRouteId === route.id);
        if (currentBus && currentBus.id !== newBusId) {
            this.busService.assignToRoute(currentBus.id, undefined);
        }

        if (newBusId) {
            this.busService.assignToRoute(newBusId, route.id);
        }

        setTimeout(() => {
            this.messageService.add({
                severity: 'success',
                summary: 'Assignment Updated',
                detail: `Assignments for ${route.name} have been updated`
            });

            this.loading.set(false);
            setTimeout(() => this.router.navigate(['/admin/assignments']), 1000);
        }, 500);
    }

    onCancel(): void {
        this.router.navigate(['/admin/assignments']);
    }
}
