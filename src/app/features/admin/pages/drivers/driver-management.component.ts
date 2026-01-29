/**
 * RouteX - Admin Driver Management Component
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
import { UserService } from '../../../../data/services/user.service';
import { RouteService } from '../../../../data/services/route.service';
import { User } from '../../../../data/models';

@Component({
    selector: 'rx-driver-management',
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
    templateUrl: './driver-management.component.html',
    styleUrl: './driver-management.component.scss'
})
export class DriverManagementComponent {
    private router = inject(Router);
    userService = inject(UserService);
    routeService = inject(RouteService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    drivers = this.userService.drivers;
    routes = this.routeService.routes;

    getRouteName(routeId?: string): string {
        if (!routeId) return 'Unassigned';
        return this.routeService.getRoute(routeId)?.name || 'Unknown';
    }

    openNew(): void {
        this.router.navigate(['/admin/drivers/new']);
    }

    editDriver(driver: User): void {
        this.router.navigate(['/admin/drivers', driver.id, 'edit']);
    }

    deleteDriver(driver: User): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to remove driver ${driver.name}?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.userService.deleteUser(driver.id);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Driver Removed', life: 3000 });
            }
        });
    }
}
