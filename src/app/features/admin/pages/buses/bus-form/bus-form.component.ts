/**
 * RouteX - Bus Form Component
 * Add/Edit bus details on a separate page
 */

import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { BusService } from '../../../../../data/services/bus.service';
import { Bus, BusStatus } from '../../../../../data/models';

@Component({
    selector: 'rx-bus-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        SelectModule,
        ToastModule,
        CheckboxModule
    ],
    providers: [MessageService],
    templateUrl: './bus-form.component.html',
    styleUrl: './bus-form.component.scss'
})
export class BusFormComponent implements OnInit {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private busService = inject(BusService);
    private messageService = inject(MessageService);

    isEditMode = signal(false);
    busId = signal<string | null>(null);
    submitted = signal(false);
    loading = signal(false);

    bus = signal<Partial<Bus>>({
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

    statusOptions: { label: string; value: BusStatus }[] = [
        { label: 'On Route', value: 'on-route' },
        { label: 'Arriving', value: 'arriving' },
        { label: 'Delayed', value: 'delayed' },
        { label: 'Idle', value: 'idle' },
        { label: 'Offline', value: 'offline' },
        { label: 'Maintenance', value: 'maintenance' }
    ];

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id && id !== 'new') {
            this.isEditMode.set(true);
            this.busId.set(id);
            this.loadBus(id);
        }
    }

    loadBus(id: string): void {
        const bus = this.busService.getBus(id);
        if (bus) {
            this.bus.set({ ...bus });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Bus not found'
            });
            this.router.navigate(['/admin/buses']);
        }
    }

    onSubmit(): void {
        this.submitted.set(true);
        const busData = this.bus();

        if (!busData.plateNumber || !busData.capacity) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Please fill in all required fields'
            });
            return;
        }

        this.loading.set(true);

        // Simulate API call
        setTimeout(() => {
            if (this.isEditMode()) {
                this.busService.updateBus(this.busId()!, busData);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Updated',
                    detail: `Bus ${busData.plateNumber} updated successfully`
                });
            } else {
                // Add new bus
                this.messageService.add({
                    severity: 'success',
                    summary: 'Created',
                    detail: `Bus ${busData.plateNumber} added to fleet`
                });
            }

            this.loading.set(false);
            setTimeout(() => this.router.navigate(['/admin/buses']), 1000);
        }, 500);
    }

    onCancel(): void {
        this.router.navigate(['/admin/buses']);
    }
}
