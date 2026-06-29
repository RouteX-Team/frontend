import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthStore } from '../../core/auth/auth-store';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  template: `
    <div class="min-h-screen grid place-items-center p-4 bg-gradient-to-br from-sky-50 to-slate-100">
      <div class="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
        @if (auth.status() === 'loading') {
          <mat-progress-bar mode="indeterminate" />
        }
        <div class="p-8">
          <div class="flex items-center gap-2 mb-6">
            <mat-icon class="text-sky-600">directions_bus</mat-icon>
            <h1 class="text-2xl font-bold text-slate-800 m-0">RouteX</h1>
          </div>
          <h2 class="text-lg font-semibold text-slate-700 m-0">Welcome back</h2>
          <p class="text-sm text-slate-500 mt-1 mb-6">Sign in to track your campus buses.</p>

          <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-2">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" autocomplete="email" />
              @if (form.controls.email.touched && form.controls.email.invalid) {
                <mat-error>Enter a valid email.</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input
                matInput
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                autocomplete="current-password"
              />
              <button
                type="button"
                mat-icon-button
                matSuffix
                (click)="showPassword.set(!showPassword())"
                [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
              >
                <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (form.controls.password.touched && form.controls.password.invalid) {
                <mat-error>Password is required.</mat-error>
              }
            </mat-form-field>

            @if (auth.error()) {
              <div class="rounded-lg bg-rose-50 text-rose-700 text-sm px-3 py-2 mb-1">
                {{ auth.error() }}
              </div>
            }

            <button
              mat-flat-button
              color="primary"
              type="submit"
              class="h-11!"
              [disabled]="auth.status() === 'loading'"
            >
              Sign in
            </button>
          </form>

          <div class="flex items-center justify-between mt-4 text-sm">
            <a routerLink="/forgot-password" class="text-sky-600 hover:underline">Forgot password?</a>
            <a routerLink="/register" class="text-sky-600 hover:underline">Create account</a>
          </div>

          <div class="mt-6 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
            <p class="font-medium text-slate-600 m-0 mb-1">Demo accounts</p>
            admin&#64;routex.edu · driver1&#64;routex.edu · student&#64;routex.edu
            <br />passwords: Admin123! / Driver123! / Student123!
          </div>
        </div>
      </div>
    </div>
  `,
})
export class Login {
  readonly auth = inject(AuthStore);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly showPassword = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor() {
    this.auth.clearError();
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    try {
      await this.auth.login(this.form.getRawValue());
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard';
      void this.router.navigateByUrl(returnUrl);
    } catch {
      // error surfaced via auth.error()
    }
  }
}
