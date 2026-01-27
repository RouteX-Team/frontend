/**
 * RouteX - Admin Layout Component
 */

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthService } from '../../../core/services';

interface NavItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'rx-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  authService = inject(AuthService);

  sidebarCollapsed = signal(false);

  navItems: NavItem[] = [
    { icon: 'pi-home', label: 'Dashboard', route: '/admin' },
    { icon: 'pi-map', label: 'Routes', route: '/admin/routes' },
    { icon: 'pi-truck', label: 'Buses', route: '/admin/buses' },
    { icon: 'pi-users', label: 'Drivers', route: '/admin/drivers' },
    { icon: 'pi-user', label: 'Students', route: '/admin/students' },
    { icon: 'pi-link', label: 'Assignments', route: '/admin/assignments' },
    { icon: 'pi-cog', label: 'Settings', route: '/admin/settings' }
  ];

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }
}
