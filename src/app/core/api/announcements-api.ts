import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Announcement, AnnouncementInput } from '../../shared/models/notification.model';

@Injectable({ providedIn: 'root' })
export class AnnouncementsApi {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/announcements';

  list(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(this.base);
  }

  create(body: AnnouncementInput): Observable<Announcement> {
    return this.http.post<Announcement>(this.base, body);
  }

  update(id: number, body: AnnouncementInput): Observable<Announcement> {
    return this.http.put<Announcement>(`${this.base}/${id}`, body);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
