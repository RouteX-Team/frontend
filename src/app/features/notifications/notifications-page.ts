import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NotificationStore } from '../../core/notifications/notification-store';

@Component({
  selector: 'app-notifications-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <header class="flex items-center gap-3 mb-4">
      <h1 class="text-2xl font-bold text-slate-800 m-0">Notifications</h1>
      @if (store.unreadCount() > 0) {
        <span class="rounded-full bg-rose-100 px-2.5 py-0.5 text-sm font-medium text-rose-700">
          {{ store.unreadCount() }} unread
        </span>
        <button mat-stroked-button type="button" class="ml-auto" (click)="store.markAllRead()">
          <mat-icon>done_all</mat-icon> Mark all read
        </button>
      }
    </header>

    <div class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2 space-y-6">
        <section class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <h2 class="text-base font-semibold text-slate-800 mt-0 mb-3">Recent</h2>
          @if (store.notifications().length === 0) {
            <p class="text-sm text-slate-500 m-0">No notifications yet.</p>
          } @else {
            <ul class="divide-y divide-slate-100">
              @for (n of store.notifications(); track n.id) {
                <li class="flex items-start gap-3 py-3" [class.opacity-60]="n.isRead">
                  <mat-icon class="mt-0.5" [class.text-sky-600]="!n.isRead" [class.text-slate-400]="n.isRead">
                    {{ icon(n.type) }}
                  </mat-icon>
                  <div class="min-w-0">
                    <p class="m-0 text-sm text-slate-700">{{ n.message }}</p>
                    <p class="m-0 text-xs text-slate-400">{{ n.createdAt | date: 'short' }}</p>
                  </div>
                  @if (!n.isRead) {
                    <button
                      mat-icon-button
                      class="ml-auto"
                      aria-label="Mark as read"
                      (click)="store.markRead(n.id)"
                    >
                      <mat-icon class="text-sky-500">mark_email_read</mat-icon>
                    </button>
                  }
                </li>
              }
            </ul>
          }
        </section>

        <section class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <h2 class="text-base font-semibold text-slate-800 mt-0 mb-3">Announcements</h2>
          @if (store.announcements().length === 0) {
            <p class="text-sm text-slate-500 m-0">No announcements.</p>
          } @else {
            <ul class="space-y-3">
              @for (a of store.announcements(); track a.id) {
                <li class="rounded-xl border-l-4 bg-slate-50 p-3" [class]="severityClass(a.severity)">
                  <div class="flex items-center gap-2">
                    <span class="font-semibold text-slate-800">{{ a.title }}</span>
                    @if (a.routeName) {
                      <span class="rounded-full bg-white px-2 py-0.5 text-xs text-slate-500 ring-1 ring-slate-200">
                        {{ a.routeName }}
                      </span>
                    }
                    <span class="ml-auto text-xs text-slate-400">{{ a.createdAt | date: 'short' }}</span>
                  </div>
                  <p class="m-0 mt-1 text-sm text-slate-600">{{ a.body }}</p>
                </li>
              }
            </ul>
          }
        </section>
      </div>

      <section class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 self-start">
        <h2 class="text-base font-semibold text-slate-800 mt-0 mb-4">Preferences</h2>
        <div class="space-y-4">
          <mat-slide-toggle
            [ngModel]="approaching()"
            (ngModelChange)="approaching.set($event)"
          >
            Approaching-bus alerts
          </mat-slide-toggle>
          <mat-slide-toggle
            [ngModel]="announcements()"
            (ngModelChange)="announcements.set($event)"
          >
            Announcements
          </mat-slide-toggle>
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Alert radius (metres)</mat-label>
            <input
              matInput
              type="number"
              min="100"
              max="5000"
              step="100"
              [ngModel]="radius()"
              (ngModelChange)="radius.set($event ?? 500)"
            />
          </mat-form-field>
          <button mat-flat-button color="primary" type="button" [disabled]="saving()" (click)="save()">
            <mat-icon>save</mat-icon> {{ saving() ? 'Saving…' : 'Save preferences' }}
          </button>
          @if (saved()) {
            <p class="m-0 text-sm text-emerald-600">Preferences saved.</p>
          }
        </div>
      </section>
    </div>
  `,
})
export class NotificationsPage {
  readonly store = inject(NotificationStore);

  readonly approaching = signal(true);
  readonly announcements = signal(true);
  readonly radius = signal(500);
  readonly saving = signal(false);
  readonly saved = signal(false);

  constructor() {
    if (!this.store.loaded()) {
      void this.store.load();
    }
    // Mirror loaded preferences into the editable form controls.
    effect(() => {
      const prefs = this.store.preferences();
      if (prefs) {
        this.approaching.set(prefs.approachingBusEnabled);
        this.announcements.set(prefs.announcementsEnabled);
        this.radius.set(prefs.approachRadiusMeters);
      }
    });
  }

  icon(type: string): string {
    switch (type) {
      case 'ApproachingBus':
        return 'directions_bus';
      case 'Announcement':
        return 'campaign';
      default:
        return 'info';
    }
  }

  severityClass(severity: string): string {
    switch (severity) {
      case 'Critical':
        return 'border-rose-500';
      case 'Warning':
        return 'border-amber-500';
      default:
        return 'border-sky-500';
    }
  }

  save(): void {
    this.saving.set(true);
    this.saved.set(false);
    void this.store
      .savePreferences({
        approachingBusEnabled: this.approaching(),
        announcementsEnabled: this.announcements(),
        approachRadiusMeters: Number(this.radius()),
      })
      .then(() => {
        this.saving.set(false);
        this.saved.set(true);
        setTimeout(() => this.saved.set(false), 2500);
      })
      .catch(() => this.saving.set(false));
  }
}
