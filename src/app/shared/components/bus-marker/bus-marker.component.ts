/**
 * RouteX - Bus Marker Component
 * Animated bus marker for map display with heading indicator
 */

import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusStatus } from '../../../data/models';

@Component({
    selector: 'rx-bus-marker',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './bus-marker.component.html',
    styleUrl: './bus-marker.component.scss'
})
export class BusMarkerComponent {
    status = input<BusStatus>('on-route');
    heading = input<number>(0);
    label = input<string>('');
    size = input<'sm' | 'md' | 'lg'>('md');
    animated = input<boolean>(true);

    markerClass = computed(() => {
        const classes = ['bus-marker', `marker-${this.size()}`, `status-${this.status()}`];
        if (this.animated() && (this.status() === 'on-route' || this.status() === 'arriving')) {
            classes.push('animated');
        }
        return classes.join(' ');
    });

    arrowStyle = computed(() => {
        return {
            transform: `rotate(${this.heading()}deg)`
        };
    });
}
