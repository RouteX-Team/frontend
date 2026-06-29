import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Schedule, ScheduleInput } from '../../shared/models/route.model';

@Injectable({ providedIn: 'root' })
export class SchedulesApi {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/schedules';

  update(id: number, body: ScheduleInput): Observable<Schedule> {
    return this.http.put<Schedule>(`${this.base}/${id}`, body);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
