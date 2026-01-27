/**
 * RouteX - Student Feature Routes
 */

import { Routes } from '@angular/router';

export const STUDENT_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/dashboard/student-dashboard.component')
            .then(m => m.StudentDashboardComponent)
    },
    {
        path: 'route/:id',
        loadComponent: () => import('./pages/route-detail/route-detail.component')
            .then(m => m.RouteDetailComponent)
    }
];
