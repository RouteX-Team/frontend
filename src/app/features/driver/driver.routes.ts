/**
 * RouteX - Driver Feature Routes
 */

import { Routes } from '@angular/router';

export const DRIVER_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/tracking/driver-tracking.component')
            .then(m => m.DriverTrackingComponent)
    }
];
