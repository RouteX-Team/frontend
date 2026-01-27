/**
 * RouteX - Login Component
 */

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, ThemeService } from '../../../../core/services';
import { UserRole } from '../../../../data/models';

@Component({
    selector: 'rx-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    authService = inject(AuthService);
    themeService = inject(ThemeService);
    private router = inject(Router);

    email = '';
    password = '';
    showPassword = signal(false);

    onSubmit(): void {
        if (!this.email || !this.password) return;

        const result = this.authService.login({ email: this.email, password: this.password });

        if (result.success) {
            this.router.navigate([this.authService.getDefaultRoute()]);
        }
    }

    quickLogin(role: UserRole): void {
        const result = this.authService.loginAsRole(role);

        if (result.success) {
            this.router.navigate([this.authService.getDefaultRoute()]);
        }
    }

    togglePassword(): void {
        this.showPassword.update(v => !v);
    }
}
