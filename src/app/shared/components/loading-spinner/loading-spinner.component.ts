/**
 * RouteX - Loading Spinner Component
 * A versatile loading indicator with multiple sizes and styles
 */

import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'rx-loading-spinner',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './loading-spinner.component.html',
    styleUrl: './loading-spinner.component.scss'
})
export class LoadingSpinnerComponent {
    size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
    variant = input<'primary' | 'white' | 'muted'>('primary');
    label = input<string>('');
    overlay = input<boolean>(false);
    fullscreen = input<boolean>(false);

    spinnerClass = computed(() => {
        return `spinner spinner-${this.size()} spinner-${this.variant()}`;
    });

    containerClass = computed(() => {
        const classes = ['loading-container'];
        if (this.overlay()) classes.push('overlay');
        if (this.fullscreen()) classes.push('fullscreen');
        return classes.join(' ');
    });
}
