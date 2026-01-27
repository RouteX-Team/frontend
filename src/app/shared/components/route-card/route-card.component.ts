/**
 * RouteX - Route Card Component
 */

import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, Bus } from '../../../data/models';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { EtaChipComponent } from '../eta-chip/eta-chip.component';

@Component({
  selector: 'rx-route-card',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent, EtaChipComponent],
  templateUrl: './route-card.component.html',
  styleUrl: './route-card.component.scss'
})
export class RouteCardComponent {
  route = input.required<Route>();
  bus = input<Bus | null>(null);
  isFavorite = input<boolean>(false);

  cardClick = output<Route>();
  favoriteToggle = output<string>();

  stopsCount = computed(() => this.route().stops.length);

  getNextStopName(): string {
    const nextStopId = this.bus()?.nextStopId;
    if (!nextStopId) return '';

    const stop = this.route().stops.find(s => s.id === nextStopId);
    return stop?.shortName || stop?.name || '';
  }

  onFavoriteClick(event: Event): void {
    event.stopPropagation();
    this.favoriteToggle.emit(this.route().id);
  }
}
