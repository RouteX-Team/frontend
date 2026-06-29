export type NotificationType = 'ApproachingBus' | 'Announcement' | 'System';

export interface AppNotification {
  id: number;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPreference {
  approachingBusEnabled: boolean;
  announcementsEnabled: boolean;
  approachRadiusMeters: number;
}

export type AnnouncementSeverity = 'Info' | 'Warning' | 'Critical';

export interface Announcement {
  id: number;
  title: string;
  body: string;
  severity: AnnouncementSeverity;
  routeId: number | null;
  routeName: string | null;
  createdBy: string;
  createdAt: string;
}

export interface AnnouncementInput {
  title: string;
  body: string;
  severity: AnnouncementSeverity;
  routeId: number | null;
}

export interface Favorite {
  id: number;
  routeId: number;
  routeNumber: string;
  routeName: string;
  createdAt: string;
}
