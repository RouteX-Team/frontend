/**
 * RouteX - Driver Form Component
 * Add/Edit driver details on a separate page
 */

import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../../../data/services/user.service';
import { RouteService } from '../../../../../data/services/route.service';
import { User } from '../../../../../data/models';

@Component({
    selector: 'rx-driver-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        SelectModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './driver-form.component.html',
    styleUrl: './driver-form.component.scss'
})
export class DriverFormComponent implements OnInit {
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private userService = inject(UserService);
    private routeService = inject(RouteService);
    private messageService = inject(MessageService);

    isEditMode = signal(false);
    driverId = signal<string | null>(null);
    submitted = signal(false);
    loading = signal(false);

    driver = signal<Partial<User>>({
        name: '',
        email: '',
        phone: '',
        role: 'driver',
        assignedRouteId: undefined
    });

    routes = this.routeService.routes;

    ngOnInit(): void {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        if (id && id !== 'new') {
            this.isEditMode.set(true);
            this.driverId.set(id);
            this.loadDriver(id);
        }
    }

    loadDriver(id: string): void {
        const driver = this.userService.getUser(id);
        if (driver) {
            this.driver.set({ ...driver });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Driver not found'
            });
            this.router.navigate(['/admin/drivers']);
        }
    }

    onSubmit(): void {
        this.submitted.set(true);
        const driverData = this.driver();

        if (!driverData.name?.trim() || !driverData.email?.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Please fill in all required fields'
            });
            return;
        }

        this.loading.set(true);

        setTimeout(() => {
            if (this.isEditMode()) {
                this.userService.updateUser(this.driverId()!, driverData);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Updated',
                    detail: `Driver ${driverData.name} updated successfully`
                });
            } else {
                this.userService.addUser({ ...driverData, role: 'driver' } as User);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Created',
                    detail: `Driver ${driverData.name} added successfully`
                });
            }

            this.loading.set(false);
            setTimeout(() => this.router.navigate(['/admin/drivers']), 1000);
        }, 500);
    }

    onCancel(): void {
        this.router.navigate(['/admin/drivers']);
    }
}
