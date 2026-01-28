/**
 * RouteX - Confirm Dialog Component
 * A reusable confirmation dialog for delete/destructive actions
 */

import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

export interface ConfirmDialogConfig {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmIcon?: string;
    severity?: 'danger' | 'warning' | 'info';
}

@Component({
    selector: 'rx-confirm-dialog',
    standalone: true,
    imports: [CommonModule, DialogModule, ButtonModule],
    templateUrl: './confirm-dialog.component.html',
    styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
    visible = signal(false);
    config = signal<ConfirmDialogConfig>({
        title: 'Confirm',
        message: 'Are you sure?'
    });

    private resolvePromise: ((value: boolean) => void) | null = null;

    /**
     * Open the dialog and return a promise that resolves to true if confirmed
     */
    open(config: ConfirmDialogConfig): Promise<boolean> {
        this.config.set({
            confirmLabel: 'Confirm',
            cancelLabel: 'Cancel',
            confirmIcon: 'pi pi-check',
            severity: 'danger',
            ...config
        });
        this.visible.set(true);

        return new Promise<boolean>((resolve) => {
            this.resolvePromise = resolve;
        });
    }

    onConfirm(): void {
        this.visible.set(false);
        this.resolvePromise?.(true);
        this.resolvePromise = null;
    }

    onCancel(): void {
        this.visible.set(false);
        this.resolvePromise?.(false);
        this.resolvePromise = null;
    }

    onHide(): void {
        if (this.resolvePromise) {
            this.resolvePromise(false);
            this.resolvePromise = null;
        }
    }

    getSeverityClass(): string {
        return `severity-${this.config().severity || 'danger'}`;
    }

    getConfirmButtonClass(): string {
        const severity = this.config().severity;
        if (severity === 'danger') return 'p-button-danger';
        if (severity === 'warning') return 'p-button-warning';
        return 'p-button-primary';
    }
}
