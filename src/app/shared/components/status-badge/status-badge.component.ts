/**
 * RouteX - Status Badge Component
 */

import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusStatus } from '../../../data/models';

@Component({
  selector: 'rx-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss'
})
export class StatusBadgeComponent {
  status = input.required<BusStatus>();
  showDot = input<boolean>(true);
  size = input<'sm' | 'md' | 'lg'>('md');

  label = computed(() => {
    const labels: Record<BusStatus, string> = {
      'on-route': 'On Route',
      'arriving': 'Arriving',
      'delayed': 'Delayed',
      'idle': 'Idle',
      'offline': 'Offline',
      'maintenance': 'Maintenance'
    };
    return labels[this.status()];
  });

  badgeClass = computed(() => {
    return `badge badge-${this.status()}`;
  });

  dotClass = computed(() => {
    const isPulsing = this.status() === 'on-route' || this.status() === 'arriving';
    return `dot dot-${this.status()} ${isPulsing ? 'pulse' : ''}`;
  });
}
