/**
 * RouteX - Admin Route Management Component
 */

import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RouteService } from '../../../../data/services/route.service';
import { Route } from '../../../../data/models';

@Component({
    selector: 'rx-route-management',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        ToggleSwitchModule,
        DialogModule,
        ConfirmDialogModule,
        ToastModule
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './route-management.component.html',
    styleUrl: './route-management.component.scss'
})
export class RouteManagementComponent {
    routeService = inject(RouteService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    routes = this.routeService.routes;

    routeDialog = signal(false);
    submitted = signal(false);

    // Form state
    editMode = signal(false);
    currentRoute = signal<Partial<Route>>({});

    openNew(): void {
        this.currentRoute.set({
            name: '',
            shortCode: '',
            description: '',
            color: '#6366f1',
            isActive: true,
            frequency: 15,
            estimatedDuration: 30,
            stops: []
        });
        this.editMode.set(false);
        this.submitted.set(false);
        this.routeDialog.set(true);
    }

    editRoute(route: Route): void {
        this.currentRoute.set({ ...route });
        this.editMode.set(true);
        this.routeDialog.set(true);
    }

    deleteRoute(route: Route): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete ${route.name}?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.routeService.deleteRoute(route.id);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Route Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog(): void {
        this.routeDialog.set(false);
        this.submitted.set(false);
    }

    saveRoute(): void {
        this.submitted.set(true);
        const route = this.currentRoute();

        if (route.name?.trim() && route.shortCode?.trim()) {
            if (this.editMode()) {
                this.routeService.updateRoute(route.id!, route);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Route Updated', life: 3000 });
            } else {
                this.routeService.addRoute(route as Route);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Route Created', life: 3000 });
            }

            this.routeDialog.set(false);
            this.currentRoute.set({});
        }
    }
}
