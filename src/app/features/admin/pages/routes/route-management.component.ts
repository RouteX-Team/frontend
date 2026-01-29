/**
 * RouteX - Admin Route Management Component
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
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
        TableModule,
        ButtonModule,
        InputTextModule,
        ConfirmDialogModule,
        ToastModule
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './route-management.component.html',
    styleUrl: './route-management.component.scss'
})
export class RouteManagementComponent {
    private router = inject(Router);
    routeService = inject(RouteService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    routes = this.routeService.routes;

    openNew(): void {
        this.router.navigate(['/admin/routes/new']);
    }

    editRoute(route: Route): void {
        this.router.navigate(['/admin/routes', route.id, 'edit']);
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
}
