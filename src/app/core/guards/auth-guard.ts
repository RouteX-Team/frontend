import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../auth/auth-store';
import { UserRole } from '../../shared/models/user.model';

/** Requires an authenticated session; otherwise redirects to /login (remembering the target). */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthStore);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

/** Requires one of the given roles. Use via `canActivate: [authGuard, roleGuard('Admin')]`. */
export function roleGuard(...roles: UserRole[]): CanActivateFn {
  return () => {
    const auth = inject(AuthStore);
    const router = inject(Router);

    if (!auth.isAuthenticated()) {
      return router.createUrlTree(['/login']);
    }
    if (auth.hasRole(...roles)) {
      return true;
    }
    return router.createUrlTree(['/forbidden']);
  };
}
