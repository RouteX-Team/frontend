/**
 * RouteX - Admin Bus Management Component
 * Manages the university bus fleet
 */

import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BusService } from '../../../../data/services/bus.service';
import { RouteService } from '../../../../data/services/route.service';
import { Bus, BusStatus } from '../../../../data/models';
import { StatusBadgeComponent } from '../../../../shared/components';

@Component({
    selector: 'rx-bus-management',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        ConfirmDialogModule,
        ToastModule,
        ProgressBarModule,
        TagModule,
        StatusBadgeComponent
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './bus-management.component.html',
    styleUrl: './bus-management.component.scss'
})
export class BusManagementComponent {
    private router = inject(Router);
    busService = inject(BusService);
    routeService = inject(RouteService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    buses = this.busService.buses;
    routes = this.routeService.routes;

    // Stats
    totalBuses = computed(() => this.buses().length);
    activeBuses = computed(() => this.buses().filter(b =>
        b.status === 'on-route' || b.status === 'arriving'
    ).length);
    maintenanceBuses = computed(() => this.buses().filter(b =>
        b.status === 'maintenance'
    ).length);
    totalCapacity = computed(() => this.buses().reduce((acc, b) => acc + b.capacity, 0));

    getRouteName(routeId?: string): string {
        if (!routeId) return 'Not Assigned';
        return this.routeService.getRoute(routeId)?.name || 'Unknown';
    }

    getFuelSeverity(level?: number): 'success' | 'warn' | 'danger' | 'secondary' {
        if (!level) return 'secondary';
        if (level >= 50) return 'success';
        if (level >= 25) return 'warn';
        return 'danger';
    }

    openNew(): void {
        this.router.navigate(['/admin/buses/new']);
    }

    editBus(bus: Bus): void {
        this.router.navigate(['/admin/buses', bus.id, 'edit']);
    }

    deleteBus(bus: Bus): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to remove bus ${bus.name || bus.plateNumber}?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // In a real app, call service to delete
                this.messageService.add({
                    severity: 'success',
                    summary: 'Deleted',
                    detail: `Bus ${bus.plateNumber} removed`
                });
            }
        });
    }

    updateStatus(bus: Bus, status: BusStatus): void {
        this.busService.updateBus(bus.id, { status });
        this.messageService.add({
            severity: 'info',
            summary: 'Status Updated',
            detail: `${bus.name || bus.plateNumber} is now ${status}`
        });
    }
}
