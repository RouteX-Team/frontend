import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppNotification, NotificationPreference } from '../../shared/models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationsApi {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/notifications';

  list(): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(this.base);
  }

  markRead(id: number): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}/read`, {});
  }

  getPreferences(): Observable<NotificationPreference> {
    return this.http.get<NotificationPreference>(`${this.base}/preferences`);
  }

  updatePreferences(body: NotificationPreference): Observable<NotificationPreference> {
    return this.http.put<NotificationPreference>(`${this.base}/preferences`, body);
  }
}
