import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { NotificationsApi } from '../api/notifications-api';
import { AnnouncementsApi } from '../api/announcements-api';
import { TrackingHubClient } from '../realtime/tracking-hub';
import {
  Announcement,
  AppNotification,
  NotificationPreference,
} from '../../shared/models/notification.model';

interface NotificationState {
  notifications: AppNotification[];
  announcements: Announcement[];
  preferences: NotificationPreference | null;
  loaded: boolean;
}

export const NotificationStore = signalStore(
  { providedIn: 'root' },
  withState<NotificationState>({
    notifications: [],
    announcements: [],
    preferences: null,
    loaded: false,
  }),
  withComputed((store) => ({
    unreadCount: computed(() => store.notifications().filter((n) => !n.isRead).length),
  })),
  withMethods(
    (
      store,
      notificationsApi = inject(NotificationsApi),
      announcementsApi = inject(AnnouncementsApi),
      hub = inject(TrackingHubClient),
    ) => ({
      prependNotification(n: AppNotification): void {
        patchState(store, (s) => ({ notifications: [n, ...s.notifications] }));
      },
      prependAnnouncement(a: Announcement): void {
        patchState(store, (s) => ({
          announcements: [a, ...s.announcements.filter((x) => x.id !== a.id)],
        }));
      },
      async load(): Promise<void> {
        try {
          await hub.connect();
        } catch {
          // notifications still load over REST; the hub reconnects on its own
        }
        const [notifications, announcements, preferences] = await Promise.all([
          firstValueFrom(notificationsApi.list()),
          firstValueFrom(announcementsApi.list()),
          firstValueFrom(notificationsApi.getPreferences()),
        ]);
        patchState(store, { notifications, announcements, preferences, loaded: true });
      },
      async markRead(id: number): Promise<void> {
        await firstValueFrom(notificationsApi.markRead(id));
        patchState(store, (s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        }));
      },
      async markAllRead(): Promise<void> {
        const unread = store.notifications().filter((n) => !n.isRead);
        await Promise.all(unread.map((n) => firstValueFrom(notificationsApi.markRead(n.id))));
        patchState(store, (s) => ({
          notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
        }));
      },
      async savePreferences(prefs: NotificationPreference): Promise<void> {
        const saved = await firstValueFrom(notificationsApi.updatePreferences(prefs));
        patchState(store, { preferences: saved });
      },
      clear(): void {
        patchState(store, { notifications: [], announcements: [], preferences: null, loaded: false });
      },
    }),
  ),
  withHooks({
    onInit(store) {
      const hub = inject(TrackingHubClient);
      hub.notificationCreated$.subscribe((n) => store.prependNotification(n));
      hub.announcementPublished$.subscribe((a) => store.prependAnnouncement(a));
    },
  }),
);
