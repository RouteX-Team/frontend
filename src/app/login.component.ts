import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, RouteXRole } from './core/auth.service';

const ROLE_LANDING: Record<RouteXRole, string> = {
  admin: '/admin/tracking',
  student: '/student',
  parent: '/parent',
  driver: '/driver',
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  email = 'elena@aldridge.edu';
  password = 'routex-demo';
  role: RouteXRole = 'admin';
  readonly roles: { id: RouteXRole; label: string; icon: string }[] = [
    { id: 'admin', label: 'Admin', icon: 'dashboard' },
    { id: 'student', label: 'Student', icon: 'school' },
    { id: 'parent', label: 'Parent', icon: 'verified_user' },
    { id: 'driver', label: 'Driver', icon: 'near_me' },
  ];

  signIn(): void {
    this.auth.login(this.email, this.role);
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    const roleDefault = ROLE_LANDING[this.role];
    const returnMatchesRole =
      !!returnUrl &&
      ((this.role === 'admin' && returnUrl.startsWith('/admin')) ||
        (this.role !== 'admin' && returnUrl === roleDefault));

    const target = returnMatchesRole && returnUrl ? returnUrl : roleDefault;
    void this.router.navigateByUrl(target);
  }
}
