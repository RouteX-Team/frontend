/**
 * RouteX - Admin Assignment Management Component
 * Manages driver-to-route and bus-to-route assignments
 */

import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
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
        TableModule,
        ButtonModule,
        ConfirmDialogModule,
        ToastModule,
        CardModule,
        StatusBadgeComponent
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './assignment-management.component.html',
    styleUrl: './assignment-management.component.scss'
})
export class AssignmentManagementComponent {
    private router = inject(Router);
    routeService = inject(RouteService);
    userService = inject(UserService);
    busService = inject(BusService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    routes = this.routeService.routes;
    drivers = this.userService.drivers;
    buses = this.busService.buses;

    // Build assignment view
    assignments = computed<AssignmentView[]>(() => {
        return this.routes().map(route => ({
            route,
            driver: this.drivers().find(d => d.assignedRouteId === route.id),
            bus: this.buses().find(b => b.currentRouteId === route.id)
        }));
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

    openNew(): void {
        this.router.navigate(['/admin/assignments/new']);
    }

    editAssignment(route: Route): void {
        this.router.navigate(['/admin/assignments', route.id, 'edit']);
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
