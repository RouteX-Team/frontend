import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-coming-soon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div class="grid place-items-center py-20 text-center">
      <div>
        <mat-icon class="w-14! h-14! text-5xl! text-slate-300">construction</mat-icon>
        <h1 class="text-xl font-semibold text-slate-700 mt-4">{{ title() }}</h1>
        <p class="text-slate-500 mt-1">This area is being built in an upcoming milestone.</p>
      </div>
    </div>
  `,
})
export class ComingSoon {
  readonly title = input('Coming soon');
}
