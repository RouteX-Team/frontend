/**
 * RouteX - Time Ago Pipe
 * Transforms a Date into a human-readable relative time string
 * Examples: "Just now", "5 min ago", "2 hours ago", "Yesterday"
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timeAgo',
    standalone: true,
    pure: false // Re-evaluate to keep time fresh
})
export class TimeAgoPipe implements PipeTransform {
    transform(value: Date | string | number | null | undefined): string {
        if (!value) return '';

        const date = value instanceof Date ? value : new Date(value);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        const diffWeek = Math.floor(diffDay / 7);
        const diffMonth = Math.floor(diffDay / 30);

        if (diffSec < 10) {
            return 'Just now';
        }

        if (diffSec < 60) {
            return `${diffSec}s ago`;
        }

        if (diffMin < 60) {
            return `${diffMin} min ago`;
        }

        if (diffHour < 24) {
            return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
        }

        if (diffDay === 1) {
            return 'Yesterday';
        }

        if (diffDay < 7) {
            return `${diffDay} days ago`;
        }

        if (diffWeek < 4) {
            return diffWeek === 1 ? '1 week ago' : `${diffWeek} weeks ago`;
        }

        if (diffMonth < 12) {
            return diffMonth === 1 ? '1 month ago' : `${diffMonth} months ago`;
        }

        const diffYear = Math.floor(diffMonth / 12);
        return diffYear === 1 ? '1 year ago' : `${diffYear} years ago`;
    }
}
