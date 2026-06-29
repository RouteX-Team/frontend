import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  // --- Public ---
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register').then((m) => m.Register),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./features/auth/forgot-password').then((m) => m.ForgotPassword),
  },
  {
    path: 'forbidden',
    loadComponent: () => import('./features/auth/forbidden').then((m) => m.Forbidden),
  },

  // --- Authenticated shell ---
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/layout/main-layout').then((m) => m.MainLayout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },

      // Routes (student + admin browse)
      {
        path: 'routes',
        loadComponent: () => import('./features/routes/route-list').then((m) => m.RouteList),
      },
      {
        path: 'routes/:id',
        loadComponent: () =>
          import('./features/routes/route-detail').then((m) => m.RouteDetailComponent),
      },

      // Live tracking (M4)
      {
        path: 'track',
        loadComponent: () => import('./features/tracking/live-map').then((m) => m.LiveMap),
      },
      {
        path: 'favorites',
        loadComponent: () => import('./features/favorites/favorites-page').then((m) => m.FavoritesPage),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/notifications/notifications-page').then((m) => m.NotificationsPage),
      },
      {
        path: 'driver',
        canActivate: [roleGuard('Driver', 'Admin')],
        loadComponent: () => import('./features/driver/driver-console').then((m) => m.DriverConsole),
      },

      // Admin area
      {
        path: 'admin',
        canActivate: [roleGuard('Admin')],
        children: [
          { path: '', loadComponent: () => import('./features/admin/admin-home').then((m) => m.AdminHome) },
          { path: 'routes', loadComponent: () => import('./features/admin/admin-routes').then((m) => m.AdminRoutes) },
          { path: 'stops', loadComponent: () => import('./features/admin/admin-stops').then((m) => m.AdminStops) },
          { path: 'buses', loadComponent: () => import('./features/admin/admin-buses').then((m) => m.AdminBuses) },
          { path: 'users', loadComponent: () => import('./features/admin/admin-users').then((m) => m.AdminUsers) },
          { path: 'announcements', loadComponent: () => import('./features/admin/admin-announcements').then((m) => m.AdminAnnouncements) },
          { path: 'reports', loadComponent: () => import('./features/admin/admin-reports').then((m) => m.AdminReports) },
        ],
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
