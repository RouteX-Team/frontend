/**
 * RouteX - Application Routes
 * Main routing configuration with lazy-loaded feature modules
 */

import { Routes } from '@angular/router';
import { roleGuard, noAuthGuard } from './core/guards';

export const routes: Routes = [
    // Default redirect
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },

    // Auth routes (login)
    {
        path: 'login',
        canActivate: [noAuthGuard],
        loadComponent: () => import('./features/auth/pages/login/login.component')
            .then(m => m.LoginComponent)
    },

    // Student routes
    {
        path: 'student',
        canActivate: [roleGuard('student')],
        loadChildren: () => import('./features/student/student.routes')
            .then(m => m.STUDENT_ROUTES)
    },

    // Driver routes
    {
        path: 'driver',
        canActivate: [roleGuard('driver')],
        loadChildren: () => import('./features/driver/driver.routes')
            .then(m => m.DRIVER_ROUTES)
    },

    // Admin routes
    {
        path: 'admin',
        canActivate: [roleGuard('admin')],
        loadChildren: () => import('./features/admin/admin.routes')
            .then(m => m.ADMIN_ROUTES)
    },

    // Wildcard - redirect to login
    {
        path: '**',
        redirectTo: 'login'
    }
];
