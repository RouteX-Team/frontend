import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Favorite } from '../../shared/models/notification.model';

@Injectable({ providedIn: 'root' })
export class FavoritesApi {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/favorites';

  list(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(this.base);
  }

  add(routeId: number): Observable<Favorite> {
    return this.http.post<Favorite>(this.base, { routeId });
  }

  remove(routeId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${routeId}`);
  }
}
