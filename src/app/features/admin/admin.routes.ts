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
            // Route Management
            {
                path: 'routes',
                loadComponent: () => import('./pages/routes/route-management.component')
                    .then(m => m.RouteManagementComponent)
            },
            {
                path: 'routes/new',
                loadComponent: () => import('./pages/routes/route-form/route-form.component')
                    .then(m => m.RouteFormComponent)
            },
            {
                path: 'routes/:id/edit',
                loadComponent: () => import('./pages/routes/route-form/route-form.component')
                    .then(m => m.RouteFormComponent)
            },
            // Bus Management
            {
                path: 'buses',
                loadComponent: () => import('./pages/buses/bus-management.component')
                    .then(m => m.BusManagementComponent)
            },
            {
                path: 'buses/new',
                loadComponent: () => import('./pages/buses/bus-form/bus-form.component')
                    .then(m => m.BusFormComponent)
            },
            {
                path: 'buses/:id/edit',
                loadComponent: () => import('./pages/buses/bus-form/bus-form.component')
                    .then(m => m.BusFormComponent)
            },
            // Driver Management
            {
                path: 'drivers',
                loadComponent: () => import('./pages/drivers/driver-management.component')
                    .then(m => m.DriverManagementComponent)
            },
            {
                path: 'drivers/new',
                loadComponent: () => import('./pages/drivers/driver-form/driver-form.component')
                    .then(m => m.DriverFormComponent)
            },
            {
                path: 'drivers/:id/edit',
                loadComponent: () => import('./pages/drivers/driver-form/driver-form.component')
                    .then(m => m.DriverFormComponent)
            },
            // Student Management
            {
                path: 'students',
                loadComponent: () => import('./pages/students/student-management.component')
                    .then(m => m.StudentManagementComponent)
            },
            {
                path: 'students/new',
                loadComponent: () => import('./pages/students/student-form/student-form.component')
                    .then(m => m.StudentFormComponent)
            },
            {
                path: 'students/:id/edit',
                loadComponent: () => import('./pages/students/student-form/student-form.component')
                    .then(m => m.StudentFormComponent)
            },
            // Assignment Management
            {
                path: 'assignments',
                loadComponent: () => import('./pages/assignments/assignment-management.component')
                    .then(m => m.AssignmentManagementComponent)
            },
            {
                path: 'assignments/new',
                loadComponent: () => import('./pages/assignments/assignment-form/assignment-form.component')
                    .then(m => m.AssignmentFormComponent)
            },
            {
                path: 'assignments/:id/edit',
                loadComponent: () => import('./pages/assignments/assignment-form/assignment-form.component')
                    .then(m => m.AssignmentFormComponent)
            },
            {
                path: 'settings',
                loadComponent: () => import('./pages/settings/admin-settings.component')
                    .then(m => m.AdminSettingsComponent)
            }
        ]
    }
];
