import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  RouteDetail,
  RouteInput,
  RouteSummary,
  Schedule,
  ScheduleInput,
} from '../../shared/models/route.model';

export interface RouteSearch {
  from?: string;
  to?: string;
  stop?: string;
}

@Injectable({ providedIn: 'root' })
export class RoutesApi {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/routes';

  getAll(includeInactive = true): Observable<RouteSummary[]> {
    const params = new HttpParams().set('includeInactive', includeInactive);
    return this.http.get<RouteSummary[]>(this.base, { params });
  }

  search(criteria: RouteSearch): Observable<RouteSummary[]> {
    let params = new HttpParams();
    if (criteria.from) params = params.set('from', criteria.from);
    if (criteria.to) params = params.set('to', criteria.to);
    if (criteria.stop) params = params.set('stop', criteria.stop);
    return this.http.get<RouteSummary[]>(`${this.base}/search`, { params });
  }

  getById(id: number): Observable<RouteDetail> {
    return this.http.get<RouteDetail>(`${this.base}/${id}`);
  }

  create(body: RouteInput): Observable<RouteDetail> {
    return this.http.post<RouteDetail>(this.base, body);
  }

  update(id: number, body: RouteInput): Observable<RouteDetail> {
    return this.http.put<RouteDetail>(`${this.base}/${id}`, body);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  getSchedules(routeId: number): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.base}/${routeId}/schedules`);
  }

  createSchedule(routeId: number, body: ScheduleInput): Observable<Schedule> {
    return this.http.post<Schedule>(`${this.base}/${routeId}/schedules`, body);
  }
}
