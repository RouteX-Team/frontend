/**
 * RouteX - Empty State Component
 * Displays a friendly message when there's no data to show
 */

import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'rx-empty-state',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    templateUrl: './empty-state.component.html',
    styleUrl: './empty-state.component.scss'
})
export class EmptyStateComponent {
    icon = input<string>('pi-inbox');
    title = input<string>('No data found');
    message = input<string>('');
    actionLabel = input<string>('');
    actionIcon = input<string>('');
    size = input<'sm' | 'md' | 'lg'>('md');

    actionClick = output<void>();

    onAction(): void {
        this.actionClick.emit();
    }
}
