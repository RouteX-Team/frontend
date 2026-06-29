import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-forbidden',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="min-h-screen grid place-items-center p-4 text-center">
      <div>
        <mat-icon class="w-16! h-16! text-6xl! text-amber-500">block</mat-icon>
        <h1 class="text-2xl font-bold text-slate-800 mt-4">Access denied</h1>
        <p class="text-slate-500 mt-2">You don't have permission to view this page.</p>
        <a mat-flat-button color="primary" routerLink="/dashboard" class="mt-6">Go to dashboard</a>
      </div>
    </div>
  `,
})
export class Forbidden {}
