import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stop, StopInput } from '../../shared/models/route.model';

@Injectable({ providedIn: 'root' })
export class StopsApi {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/stops';

  getAll(): Observable<Stop[]> {
    return this.http.get<Stop[]>(this.base);
  }

  create(body: StopInput): Observable<Stop> {
    return this.http.post<Stop>(this.base, body);
  }

  update(id: number, body: StopInput): Observable<Stop> {
    return this.http.put<Stop>(`${this.base}/${id}`, body);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
