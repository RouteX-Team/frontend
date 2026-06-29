import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StartTripRequest, Trip } from '../../shared/models/tracking.model';

@Injectable({ providedIn: 'root' })
export class TripsApi {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/trips';

  start(body: StartTripRequest): Observable<Trip> {
    return this.http.post<Trip>(`${this.base}/start`, body);
  }

  end(id: number): Observable<Trip> {
    return this.http.post<Trip>(`${this.base}/${id}/end`, {});
  }

  active(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.base}/active`);
  }

  mine(): Observable<Trip | null> {
    return this.http.get<Trip | null>(`${this.base}/mine`);
  }
}
