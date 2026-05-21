import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-admin-topbar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './admin-topbar.component.html',
  styleUrl: './admin-topbar.component.css',
})
export class AdminTopbarComponent {
  @Input({ required: true }) current = 'tracking';
  @Input({ required: true }) title = '';
  @Input() subtitle = '';
  @Input() theme = 'light';
  @Input() userName = 'Elena Marquez';
  @Input() userInitials = 'EM';
  @Input() search = '';
  @Output() notifications = new EventEmitter<void>();
  @Output() themeToggle = new EventEmitter<void>();
  @Output() dispatch = new EventEmitter<void>();
  @Output() exportView = new EventEmitter<void>();
  @Output() filter = new EventEmitter<void>();
  @Output() create = new EventEmitter<void>();
  @Output() today = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  @Output() searchChange = new EventEmitter<string>();

  updateSearch(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }
}
