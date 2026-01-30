/**
 * RouteX - Route Form Component
 * Add/Edit route details on a separate page
 */

import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { RouteService } from '../../../../../data/services/route.service';
import { Route, Stop } from '../../../../../data/models';

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
        ToastModule,
        CheckboxModule
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

    // Stops management
    stops = signal<Stop[]>([]);
    showAddStop = signal(false);
    editingStopId = signal<string | null>(null);
    newStop = signal<Partial<Stop>>({
        name: '',
        shortName: '',
        address: '',
        isMainStop: false,
        location: { lat: 0, lng: 0 }
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
            this.stops.set([...(route.stops || [])]);
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Route not found'
            });
            this.router.navigate(['/admin/routes']);
        }
    }

    // Stop management methods
    addStop(): void {
        this.showAddStop.set(true);
        this.editingStopId.set(null);
        this.newStop.set({
            name: '',
            shortName: '',
            address: '',
            isMainStop: false,
            location: { lat: 0, lng: 0 }
        });
    }

    editStop(stop: Stop): void {
        this.editingStopId.set(stop.id);
        this.showAddStop.set(true);
        this.newStop.set({ ...stop });
    }

    saveStop(): void {
        const stopData = this.newStop();
        if (!stopData.name?.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Stop name is required'
            });
            return;
        }

        const currentStops = [...this.stops()];

        if (this.editingStopId()) {
            // Update existing stop
            const index = currentStops.findIndex(s => s.id === this.editingStopId());
            if (index !== -1) {
                currentStops[index] = { ...currentStops[index], ...stopData } as Stop;
            }
        } else {
            // Add new stop
            const newId = `stop-${Date.now()}`;
            const order = currentStops.length + 1;
            currentStops.push({
                ...stopData,
                id: newId,
                order,
                location: stopData.location || { lat: 0, lng: 0 }
            } as Stop);
        }

        this.stops.set(currentStops);
        this.cancelStopEdit();

        this.messageService.add({
            severity: 'success',
            summary: this.editingStopId() ? 'Updated' : 'Added',
            detail: `Stop "${stopData.name}" ${this.editingStopId() ? 'updated' : 'added'}`
        });
    }

    cancelStopEdit(): void {
        this.showAddStop.set(false);
        this.editingStopId.set(null);
        this.newStop.set({
            name: '',
            shortName: '',
            address: '',
            isMainStop: false,
            location: { lat: 0, lng: 0 }
        });
    }

    removeStop(stop: Stop): void {
        const currentStops = this.stops().filter(s => s.id !== stop.id);
        // Reorder remaining stops
        currentStops.forEach((s, index) => s.order = index + 1);
        this.stops.set(currentStops);

        this.messageService.add({
            severity: 'info',
            summary: 'Removed',
            detail: `Stop "${stop.name}" removed`
        });
    }

    moveStopUp(index: number): void {
        if (index <= 0) return;
        const currentStops = [...this.stops()];
        [currentStops[index - 1], currentStops[index]] = [currentStops[index], currentStops[index - 1]];
        currentStops.forEach((s, i) => s.order = i + 1);
        this.stops.set(currentStops);
    }

    moveStopDown(index: number): void {
        const currentStops = [...this.stops()];
        if (index >= currentStops.length - 1) return;
        [currentStops[index], currentStops[index + 1]] = [currentStops[index + 1], currentStops[index]];
        currentStops.forEach((s, i) => s.order = i + 1);
        this.stops.set(currentStops);
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

        // Include stops in route data
        routeData.stops = this.stops();

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
