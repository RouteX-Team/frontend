/**
 * RouteX - ETA Pipe
 * Transforms minutes into an ETA display format
 * Examples: "2 min", "< 1 min", "15 min", "Arriving"
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'eta',
    standalone: true
})
export class EtaPipe implements PipeTransform {
    transform(minutes: number | null | undefined): string {
        if (minutes === null || minutes === undefined) {
            return '--';
        }

        if (minutes < 0) {
            return 'Passed';
        }

        if (minutes === 0) {
            return 'Arriving';
        }

        if (minutes < 1) {
            return '< 1 min';
        }

        if (minutes < 60) {
            return `${Math.round(minutes)} min`;
        }

        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);

        if (mins === 0) {
            return `${hours}h`;
        }

        return `${hours}h ${mins}m`;
    }
}
