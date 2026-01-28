/**
 * RouteX - Bottom Navigation Component
 * Mobile-first bottom navigation bar for student/driver views
 */

import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NavItem {
    id: string;
    label: string;
    icon: string;
    route?: string;
    badge?: number;
}

@Component({
    selector: 'rx-bottom-nav',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './bottom-nav.component.html',
    styleUrl: './bottom-nav.component.scss'
})
export class BottomNavComponent {
    items = input.required<NavItem[]>();
    activeId = input<string>('');

    itemClick = output<NavItem>();

    onItemClick(item: NavItem): void {
        this.itemClick.emit(item);
    }

    isActive(item: NavItem): boolean {
        return item.id === this.activeId();
    }
}
