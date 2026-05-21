import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/auth.guard';
import { LoginComponent } from './login.component';
import { RoleAppComponent } from './role-app.component';
import { RoleRedirectComponent } from './role-redirect.component';
import { WorkspaceComponent } from './workspace.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', pathMatch: 'full', component: RoleRedirectComponent, canActivate: [authGuard] },
  { path: 'tracking', pathMatch: 'full', redirectTo: 'admin/tracking' },
  { path: 'dashboard', pathMatch: 'full', redirectTo: 'admin/dashboard' },
  { path: 'admin', pathMatch: 'full', redirectTo: 'admin/tracking' },
  {
    path: 'admin/:screen',
    component: WorkspaceComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'student',
    component: RoleAppComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['student'], role: 'student' },
  },
  {
    path: 'parent',
    component: RoleAppComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['parent'], role: 'parent' },
  },
  {
    path: 'driver',
    component: RoleAppComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['driver'], role: 'driver' },
  },
  { path: '**', component: RoleRedirectComponent, canActivate: [authGuard] },
];
