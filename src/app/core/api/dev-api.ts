import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../../shared/models/tracking.model';

/** Drives the backend dev location simulator (only active when DevSimulator:Enabled). */
@Injectable({ providedIn: 'root' })
export class DevApi {
  private readonly http = inject(HttpClient);

  simulateTrip(routeId: number, busId: number, loops = 1): Observable<Trip> {
    const params = new HttpParams()
      .set('routeId', routeId)
      .set('busId', busId)
      .set('loops', loops);
    return this.http.post<Trip>('/api/dev/simulate-trip', {}, { params });
  }

  stopSimulation(busId: number): Observable<void> {
    const params = new HttpParams().set('busId', busId);
    return this.http.post<void>('/api/dev/stop-simulation', {}, { params });
  }

  stopAll(): Observable<void> {
    return this.http.post<void>('/api/dev/stop-all-simulations', {});
  }
}
