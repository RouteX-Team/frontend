/**
 * RouteX - Admin Feature Routes
 */

import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '../../shared/layouts/admin-layout/admin-layout.component';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/dashboard/admin-dashboard.component')
                    .then(m => m.AdminDashboardComponent)
            },
            {
                path: 'routes',
                loadComponent: () => import('./pages/routes/route-management.component')
                    .then(m => m.RouteManagementComponent)
            },
            {
                path: 'buses',
                loadComponent: () => import('./pages/dashboard/admin-dashboard.component')
                    .then(m => m.AdminDashboardComponent) // Placeholder
            },
            {
                path: 'drivers',
                loadComponent: () => import('./pages/drivers/driver-management.component')
                    .then(m => m.DriverManagementComponent)
            },
            {
                path: 'students',
                loadComponent: () => import('./pages/students/student-management.component')
                    .then(m => m.StudentManagementComponent)
            },
            {
                path: 'assignments',
                loadComponent: () => import('./pages/dashboard/admin-dashboard.component')
                    .then(m => m.AdminDashboardComponent) // Placeholder
            },
            {
                path: 'settings',
                loadComponent: () => import('./pages/dashboard/admin-dashboard.component')
                    .then(m => m.AdminDashboardComponent) // Placeholder
            }
        ]
    }
];
