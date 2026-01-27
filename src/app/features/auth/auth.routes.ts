/**
 * RouteX - Auth Feature Routes
 */

import { Routes } from '@angular/router';
import { noAuthGuard } from '../../core/guards';

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        canActivate: [noAuthGuard],
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
    }
];
