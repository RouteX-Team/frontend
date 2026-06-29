import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersApi } from '../../core/api/users-api';
import { User, UserRole } from '../../shared/models/user.model';
import { extractApiError } from '../../core/api/api-error';

@Component({
  selector: 'app-admin-users',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatSelectModule, MatSlideToggleModule, MatIconModule],
  template: `
    <header class="mb-5">
      <h1 class="text-2xl font-bold text-slate-800 m-0">Users</h1>
      <p class="text-slate-500 mt-1 text-sm">Manage roles and account status.</p>
    </header>

    @if (loading()) {
      <p class="text-slate-500">Loading…</p>
    } @else {
      <div class="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th class="px-4 py-3 font-medium">Name</th>
              <th class="px-4 py-3 font-medium">Email</th>
              <th class="px-4 py-3 font-medium">Role</th>
              <th class="px-4 py-3 font-medium">Active</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (user of users(); track user.id) {
              <tr class="hover:bg-slate-50">
                <td class="px-4 py-3 font-medium text-slate-700">{{ user.fullName }}</td>
                <td class="px-4 py-3 text-slate-500">{{ user.email }}</td>
                <td class="px-4 py-2">
                  <mat-select
                    [value]="user.role"
                    (selectionChange)="changeRole(user, $event.value)"
                    class="min-w-28"
                  >
                    @for (role of roles; track role) {
                      <mat-option [value]="role">{{ role }}</mat-option>
                    }
                  </mat-select>
                </td>
                <td class="px-4 py-3">
                  <mat-slide-toggle
                    [checked]="user.isActive"
                    (change)="changeStatus(user, $event.checked)"
                  />
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
})
export class AdminUsers {
  private readonly api = inject(UsersApi);
  private readonly snack = inject(MatSnackBar);

  readonly roles: UserRole[] = ['Student', 'Driver', 'Admin'];
  readonly users = signal<User[]>([]);
  readonly loading = signal(true);

  constructor() {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.api.getAll().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  changeRole(user: User, role: UserRole): void {
    this.api.updateRole(user.id, role).subscribe({
      next: () => {
        this.snack.open(`${user.fullName} is now ${role}.`, 'OK', { duration: 2500 });
        this.load();
      },
      error: (err) => this.snack.open(extractApiError(err), 'Dismiss', { duration: 4000 }),
    });
  }

  changeStatus(user: User, isActive: boolean): void {
    this.api.updateStatus(user.id, isActive).subscribe({
      next: () =>
        this.snack.open(`${user.fullName} ${isActive ? 'activated' : 'deactivated'}.`, 'OK', {
          duration: 2500,
        }),
      error: (err) => this.snack.open(extractApiError(err), 'Dismiss', { duration: 4000 }),
    });
  }
}
