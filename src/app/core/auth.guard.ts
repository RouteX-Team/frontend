import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

const roleLanding: Record<string, string> = {
  admin: '/admin/tracking',
  student: '/student',
  parent: '/parent',
  driver: '/driver',
};

export const authGuard: CanActivateFn = (_route, state) => {
  const platformId = inject(PLATFORM_ID);
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!isPlatformBrowser(platformId) || auth.user()) {
    return true;
  }

  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

export const roleGuard: CanActivateFn = (route) => {
  const platformId = inject(PLATFORM_ID);
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.user();

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (!user) {
    return router.createUrlTree(['/login']);
  }

  const allowed = (route.data['roles'] as string[] | undefined) ?? [];
  if (!allowed.length || allowed.includes(user.role)) {
    return true;
  }

  return router.parseUrl(roleLanding[user.role]);
};
