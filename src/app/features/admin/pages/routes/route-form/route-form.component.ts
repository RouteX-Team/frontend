/**
 * RouteX - Route Form Component
 * Add/Edit route details on a separate page
 */

import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RouteService } from '../../../../../data/services/route.service';
import { Route } from '../../../../../data/models';

@Component({
    selector: 'rx-route-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
        InputNumberModule,
        ToggleSwitchModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './route-form.component.html',
    styleUrl: './route-form.component.scss'
})
export class RouteFormComponent implements OnInit {
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private routeService = inject(RouteService);
    private messageService = inject(MessageService);

    isEditMode = signal(false);
    routeId = signal<string | null>(null);
    submitted = signal(false);
    loading = signal(false);

    route = signal<Partial<Route>>({
        name: '',
        shortCode: '',
        description: '',
        color: '#6366f1',
        isActive: true,
        frequency: 15,
        estimatedDuration: 30,
        stops: []
    });

    ngOnInit(): void {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        if (id && id !== 'new') {
            this.isEditMode.set(true);
            this.routeId.set(id);
            this.loadRoute(id);
        }
    }

    loadRoute(id: string): void {
        const route = this.routeService.getRoute(id);
        if (route) {
            this.route.set({ ...route });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Route not found'
            });
            this.router.navigate(['/admin/routes']);
        }
    }

    onSubmit(): void {
        this.submitted.set(true);
        const routeData = this.route();

        if (!routeData.name?.trim() || !routeData.shortCode?.trim()) {
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
                this.routeService.updateRoute(this.routeId()!, routeData);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Updated',
                    detail: `Route ${routeData.name} updated successfully`
                });
            } else {
                this.routeService.addRoute(routeData as Route);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Created',
                    detail: `Route ${routeData.name} created successfully`
                });
            }

            this.loading.set(false);
            setTimeout(() => this.router.navigate(['/admin/routes']), 1000);
        }, 500);
    }

    onCancel(): void {
        this.router.navigate(['/admin/routes']);
    }
}
