import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthApi } from '../../core/api/auth-api';

@Component({
  selector: 'app-forgot-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="min-h-screen grid place-items-center p-4 bg-gradient-to-br from-sky-50 to-slate-100">
      <div class="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-black/5 p-8">
        <div class="flex items-center gap-2 mb-6">
          <mat-icon class="text-sky-600">lock_reset</mat-icon>
          <h1 class="text-2xl font-bold text-slate-800 m-0">Reset password</h1>
        </div>

        @if (message()) {
          <div class="rounded-lg bg-emerald-50 text-emerald-700 text-sm px-3 py-2 mb-4">
            {{ message() }}
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-2">
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" />
            @if (form.controls.email.touched && form.controls.email.invalid) {
              <mat-error>Enter a valid email.</mat-error>
            }
          </mat-form-field>
          <button mat-flat-button color="primary" type="submit" class="h-11!" [disabled]="busy()">
            Send reset link
          </button>
        </form>

        <p class="text-sm text-slate-500 mt-4 text-center">
          <a routerLink="/login" class="text-sky-600 hover:underline">Back to sign in</a>
        </p>
      </div>
    </div>
  `,
})
export class ForgotPassword {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AuthApi);

  readonly busy = signal(false);
  readonly message = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    this.api.forgotPassword(this.form.getRawValue()).subscribe({
      next: (res) => {
        this.message.set(res.message);
        this.busy.set(false);
      },
      error: () => {
        this.message.set('If an account exists for this email, a reset link will be sent.');
        this.busy.set(false);
      },
    });
  }
}
