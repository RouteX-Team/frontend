import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LiveBus, StopEta } from '../../shared/models/tracking.model';

@Injectable({ providedIn: 'root' })
export class TrackingApi {
  private readonly http = inject(HttpClient);

  getActive(): Observable<LiveBus[]> {
    return this.http.get<LiveBus[]>('/api/tracking/active');
  }

  getEta(stopId: number, routeId: number): Observable<StopEta> {
    const params = new HttpParams().set('stopId', stopId).set('routeId', routeId);
    return this.http.get<StopEta>('/api/tracking/eta', { params });
  }
}
