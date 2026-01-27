/**
 * RouteX - Admin Driver Management Component
 */

import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
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
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        DialogModule,
        AutoCompleteModule,
        ConfirmDialogModule,
        ToastModule
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './driver-management.component.html',
    styleUrl: './driver-management.component.scss'
})
export class DriverManagementComponent {
    userService = inject(UserService);
    routeService = inject(RouteService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    drivers = this.userService.drivers;
    routes = this.routeService.routes;

    userDialog = signal(false);
    submitted = signal(false);
    editMode = signal(false);
    currentUser = signal<Partial<User>>({});

    getRouteName(routeId?: string): string {
        if (!routeId) return 'Unassigned';
        return this.routeService.getRoute(routeId)?.name || 'Unknown';
    }

    openNew(): void {
        this.currentUser.set({
            name: '',
            email: '',
            role: 'driver',
            assignedRouteId: undefined
        });
        this.editMode.set(false);
        this.submitted.set(false);
        this.userDialog.set(true);
    }

    editDriver(driver: User): void {
        this.currentUser.set({ ...driver });
        this.editMode.set(true);
        this.userDialog.set(true);
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

    saveDriver(): void {
        this.submitted.set(true);
        const user = this.currentUser();

        if (user.name?.trim() && user.email?.trim()) {
            if (this.editMode()) {
                this.userService.updateUser(user.id!, user);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Driver Updated', life: 3000 });
            } else {
                this.userService.addUser(user as User);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Driver Added', life: 3000 });
            }

            this.userDialog.set(false);
            this.currentUser.set({});
        }
    }
}
