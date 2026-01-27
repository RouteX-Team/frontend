/**
 * RouteX - ETA Chip Component
 */

import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'rx-eta-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eta-chip.component.html',
  styleUrl: './eta-chip.component.scss'
})
export class EtaChipComponent {
  eta = input.required<number>();
  isDelayed = input<boolean>(false);

  formattedEta = computed(() => {
    const minutes = this.eta();

    if (minutes < 1) {
      return 'Now';
    } else if (minutes === 1) {
      return '1 min';
    } else if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
  });

  chipClass = computed(() => {
    if (this.isDelayed()) {
      return 'chip chip-delayed';
    }

    const minutes = this.eta();
    if (minutes < 3) {
      return 'chip chip-soon';
    } else if (minutes <= 10) {
      return 'chip chip-normal';
    } else {
      return 'chip chip-far';
    }
  });
}
