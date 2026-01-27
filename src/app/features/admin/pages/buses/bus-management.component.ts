/**
 * RouteX - Admin Bus Management Component
 * Manages the university bus fleet
 */

import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
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
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        DialogModule,
        SelectModule,
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
    busService = inject(BusService);
    routeService = inject(RouteService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    buses = this.busService.buses;
    routes = this.routeService.routes;

    busDialog = signal(false);
    submitted = signal(false);
    editMode = signal(false);
    currentBus = signal<Partial<Bus>>({});

    statusOptions: { label: string; value: BusStatus }[] = [
        { label: 'On Route', value: 'on-route' },
        { label: 'Arriving', value: 'arriving' },
        { label: 'Delayed', value: 'delayed' },
        { label: 'Idle', value: 'idle' },
        { label: 'Offline', value: 'offline' },
        { label: 'Maintenance', value: 'maintenance' }
    ];

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
        this.currentBus.set({
            plateNumber: '',
            name: '',
            capacity: 40,
            model: '',
            year: new Date().getFullYear(),
            status: 'idle',
            fuelLevel: 100,
            isAirConditioned: true,
            features: []
        });
        this.editMode.set(false);
        this.submitted.set(false);
        this.busDialog.set(true);
    }

    editBus(bus: Bus): void {
        this.currentBus.set({ ...bus });
        this.editMode.set(true);
        this.busDialog.set(true);
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

    saveBus(): void {
        this.submitted.set(true);

        const bus = this.currentBus();
        if (!bus.plateNumber || !bus.capacity) {
            return;
        }

        if (this.editMode()) {
            this.busService.updateBus(bus.id!, bus);
            this.messageService.add({
                severity: 'success',
                summary: 'Updated',
                detail: `Bus ${bus.plateNumber} updated`
            });
        } else {
            // In a real app, call service to add
            this.messageService.add({
                severity: 'success',
                summary: 'Added',
                detail: `Bus ${bus.plateNumber} added to fleet`
            });
        }

        this.busDialog.set(false);
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
