import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface AdminNavItem {
  id: string;
  name: string;
  icon: string;
  count?: number;
  badge?: string;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css',
})
export class AdminSidebarComponent {
  @Input({ required: true }) current = 'tracking';
  @Input({ required: true }) navSections: { label: string; items: AdminNavItem[] }[] = [];
  @Output() nav = new EventEmitter<string>();
}
