import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, RouteXRole } from './core/auth.service';

const ROLE_LANDING: Record<RouteXRole, string> = {
  admin: '/admin/tracking',
  student: '/student',
  parent: '/parent',
  driver: '/driver',
};

@Component({
  selector: 'app-role-redirect',
  standalone: true,
  template: '',
})
export class RoleRedirectComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const user = this.auth.user();
    void this.router.navigateByUrl(user ? ROLE_LANDING[user.role] : '/login');
  }
}
