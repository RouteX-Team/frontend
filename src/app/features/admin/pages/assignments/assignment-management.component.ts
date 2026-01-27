/**
 * RouteX - Admin Assignment Management Component
 * Manages driver-to-route and bus-to-route assignments
 */

import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RouteService } from '../../../../data/services/route.service';
import { UserService } from '../../../../data/services/user.service';
import { BusService } from '../../../../data/services/bus.service';
import { Route, User, Bus } from '../../../../data/models';
import { StatusBadgeComponent } from '../../../../shared/components';

interface AssignmentView {
    route: Route;
    driver?: User;
    bus?: Bus;
}

@Component({
    selector: 'rx-assignment-management',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        DialogModule,
        SelectModule,
        ConfirmDialogModule,
        ToastModule,
        CardModule,
        DividerModule,
        StatusBadgeComponent
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './assignment-management.component.html',
    styleUrl: './assignment-management.component.scss'
})
export class AssignmentManagementComponent {
    routeService = inject(RouteService);
    userService = inject(UserService);
    busService = inject(BusService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    routes = this.routeService.routes;
    drivers = this.userService.drivers;
    buses = this.busService.buses;

    assignDialog = signal(false);
    currentRoute = signal<Route | null>(null);
    selectedDriverId = signal<string | null>(null);
    selectedBusId = signal<string | null>(null);

    // Build assignment view
    assignments = computed<AssignmentView[]>(() => {
        return this.routes().map(route => ({
            route,
            driver: this.drivers().find(d => d.assignedRouteId === route.id),
            bus: this.buses().find(b => b.currentRouteId === route.id)
        }));
    });

    // Available (unassigned) resources
    availableDrivers = computed(() => {
        const currentRouteId = this.currentRoute()?.id;
        return this.drivers().filter(d =>
            !d.assignedRouteId || d.assignedRouteId === currentRouteId
        );
    });

    availableBuses = computed(() => {
        const currentRouteId = this.currentRoute()?.id;
        return this.buses().filter(b =>
            !b.currentRouteId || b.currentRouteId === currentRouteId
        );
    });

    // Stats
    assignedRoutes = computed(() =>
        this.assignments().filter(a => a.driver && a.bus).length
    );
    unassignedRoutes = computed(() =>
        this.assignments().filter(a => !a.driver || !a.bus).length
    );
    activeDrivers = computed(() =>
        this.drivers().filter(d => d.assignedRouteId).length
    );
    activeBuses = computed(() =>
        this.buses().filter(b => b.currentRouteId).length
    );

    openAssignDialog(route: Route): void {
        this.currentRoute.set(route);

        // Find current assignments
        const currentDriver = this.drivers().find(d => d.assignedRouteId === route.id);
        const currentBus = this.buses().find(b => b.currentRouteId === route.id);

        this.selectedDriverId.set(currentDriver?.id || null);
        this.selectedBusId.set(currentBus?.id || null);
        this.assignDialog.set(true);
    }

    saveAssignment(): void {
        const route = this.currentRoute();
        if (!route) return;

        const newDriverId = this.selectedDriverId();
        const newBusId = this.selectedBusId();

        // Update driver assignment
        // First, unassign any driver currently on this route
        const currentDriver = this.drivers().find(d => d.assignedRouteId === route.id);
        if (currentDriver && currentDriver.id !== newDriverId) {
            this.userService.updateUser(currentDriver.id, { assignedRouteId: undefined });
        }

        // Assign new driver if selected
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

        this.messageService.add({
            severity: 'success',
            summary: 'Assignment Updated',
            detail: `Assignments for ${route.name} have been updated`
        });

        this.assignDialog.set(false);
    }

    clearAssignment(assignment: AssignmentView): void {
        this.confirmationService.confirm({
            message: `Clear all assignments for ${assignment.route.name}?`,
            header: 'Confirm Clear',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (assignment.driver) {
                    this.userService.updateUser(assignment.driver.id, { assignedRouteId: undefined });
                }
                if (assignment.bus) {
                    this.busService.assignToRoute(assignment.bus.id, undefined);
                }

                this.messageService.add({
                    severity: 'info',
                    summary: 'Cleared',
                    detail: `Assignments for ${assignment.route.name} have been cleared`
                });
            }
        });
    }

    getAssignmentStatus(assignment: AssignmentView): 'complete' | 'partial' | 'unassigned' {
        if (assignment.driver && assignment.bus) return 'complete';
        if (assignment.driver || assignment.bus) return 'partial';
        return 'unassigned';
    }
}
