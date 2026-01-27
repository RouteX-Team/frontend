/**
 * RouteX - Role Guard
 * Protects routes based on user role
 */

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../../data/models';

/**
 * Factory function to create role-based guards
 * Usage: canActivate: [roleGuard('admin')]
 * Or for multiple roles: canActivate: [roleGuard(['admin', 'driver'])]
 */
export function roleGuard(allowedRoles: UserRole | UserRole[]): CanActivateFn {
    return () => {
        const authService = inject(AuthService);
        const router = inject(Router);

        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

        if (!authService.isAuthenticated()) {
            router.navigate(['/login']);
            return false;
        }

        if (authService.hasAnyRole(roles)) {
            return true;
        }

        // Redirect to appropriate dashboard if logged in but wrong role
        router.navigate([authService.getDefaultRoute()]);
        return false;
    };
}

/**
 * Guard that requires any authenticated user
 */
export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    router.navigate(['/login']);
    return false;
};

/**
 * Guard that redirects authenticated users away from login page
 */
export const noAuthGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
        return true;
    }

    // Already logged in, redirect to dashboard
    router.navigate([authService.getDefaultRoute()]);
    return false;
};
