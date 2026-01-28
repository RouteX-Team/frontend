/**
 * RouteX - Distance Pipe
 * Transforms meters into a human-readable distance string
 * Examples: "50 m", "1.2 km", "500 m"
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'distance',
    standalone: true
})
export class DistancePipe implements PipeTransform {
    transform(meters: number | null | undefined): string {
        if (meters === null || meters === undefined) {
            return '--';
        }

        if (meters < 0) {
            return '--';
        }

        if (meters < 1000) {
            return `${Math.round(meters)} m`;
        }

        const km = meters / 1000;
        if (km < 10) {
            return `${km.toFixed(1)} km`;
        }

        return `${Math.round(km)} km`;
    }
}
