/**
 * RouteX - Duration Pipe
 * Transforms minutes into a human-readable duration string
 * Examples: "5 min", "1h 30min", "2h"
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'duration',
    standalone: true
})
export class DurationPipe implements PipeTransform {
    transform(minutes: number | null | undefined, format: 'short' | 'long' = 'short'): string {
        if (minutes === null || minutes === undefined || minutes < 0) {
            return '';
        }

        if (minutes === 0) {
            return format === 'long' ? '0 minutes' : '0 min';
        }

        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);

        if (format === 'long') {
            if (hours === 0) {
                return mins === 1 ? '1 minute' : `${mins} minutes`;
            }
            if (mins === 0) {
                return hours === 1 ? '1 hour' : `${hours} hours`;
            }
            const hourStr = hours === 1 ? '1 hour' : `${hours} hours`;
            const minStr = mins === 1 ? '1 minute' : `${mins} minutes`;
            return `${hourStr} ${minStr}`;
        }

        // Short format
        if (hours === 0) {
            return `${mins} min`;
        }
        if (mins === 0) {
            return `${hours}h`;
        }
        return `${hours}h ${mins}min`;
    }
}
