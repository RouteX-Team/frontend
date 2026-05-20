import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { LoginComponent } from './login.component';
import { WorkspaceComponent } from './workspace.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', pathMatch: 'full', redirectTo: 'tracking' },
  {
    path: ':screen',
    component: WorkspaceComponent,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'tracking' },
];
