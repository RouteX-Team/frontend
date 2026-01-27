/**
 * RouteX - Admin Settings Component
 * System configuration and preferences
 */

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ThemeService } from '../../../../core/services/theme.service';

interface SystemSettings {
    // General
    systemName: string;
    universityName: string;
    supportEmail: string;

    // Tracking
    trackingUpdateInterval: number;
    maxEtaMinutes: number;
    showDelayedThreshold: number;

    // Notifications
    enableEmailNotifications: boolean;
    enablePushNotifications: boolean;
    notifyOnDelay: boolean;
    notifyOnArrival: boolean;

    // Display
    defaultMapZoom: number;
    showBusCapacity: boolean;
    showEstimatedArrival: boolean;
}

@Component({
    selector: 'rx-admin-settings',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        ToggleSwitchModule,
        SelectModule,
        CardModule,
        DividerModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './admin-settings.component.html',
    styleUrl: './admin-settings.component.scss'
})
export class AdminSettingsComponent {
    themeService = inject(ThemeService);
    private messageService = inject(MessageService);

    isDarkMode = this.themeService.isDark;

    settings = signal<SystemSettings>({
        // General
        systemName: 'RouteX',
        universityName: 'University Transport System',
        supportEmail: 'support@routex.edu',

        // Tracking
        trackingUpdateInterval: 3,
        maxEtaMinutes: 30,
        showDelayedThreshold: 5,

        // Notifications
        enableEmailNotifications: true,
        enablePushNotifications: true,
        notifyOnDelay: true,
        notifyOnArrival: false,

        // Display
        defaultMapZoom: 15,
        showBusCapacity: true,
        showEstimatedArrival: true
    });

    zoomOptions = [
        { label: 'Close (17)', value: 17 },
        { label: 'Medium (15)', value: 15 },
        { label: 'Far (13)', value: 13 },
        { label: 'Very Far (11)', value: 11 }
    ];

    intervalOptions = [
        { label: '1 second', value: 1 },
        { label: '3 seconds', value: 3 },
        { label: '5 seconds', value: 5 },
        { label: '10 seconds', value: 10 }
    ];

    toggleTheme(): void {
        this.themeService.toggle();
    }

    saveSettings(): void {
        // In a real app, this would call an API
        this.messageService.add({
            severity: 'success',
            summary: 'Settings Saved',
            detail: 'Your settings have been saved successfully'
        });
    }

    resetToDefaults(): void {
        this.settings.set({
            systemName: 'RouteX',
            universityName: 'University Transport System',
            supportEmail: 'support@routex.edu',
            trackingUpdateInterval: 3,
            maxEtaMinutes: 30,
            showDelayedThreshold: 5,
            enableEmailNotifications: true,
            enablePushNotifications: true,
            notifyOnDelay: true,
            notifyOnArrival: false,
            defaultMapZoom: 15,
            showBusCapacity: true,
            showEstimatedArrival: true
        });

        this.messageService.add({
            severity: 'info',
            summary: 'Reset Complete',
            detail: 'Settings have been reset to defaults'
        });
    }

    exportSettings(): void {
        const dataStr = JSON.stringify(this.settings(), null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'routex-settings.json';
        a.click();
        window.URL.revokeObjectURL(url);

        this.messageService.add({
            severity: 'success',
            summary: 'Exported',
            detail: 'Settings exported to file'
        });
    }
}
