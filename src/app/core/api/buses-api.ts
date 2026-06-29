import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bus, BusInput } from '../../shared/models/bus.model';

@Injectable({ providedIn: 'root' })
export class BusesApi {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/buses';

  getAll(): Observable<Bus[]> {
    return this.http.get<Bus[]>(this.base);
  }

  getActive(): Observable<Bus[]> {
    return this.http.get<Bus[]>(`${this.base}/active`);
  }

  create(body: BusInput): Observable<Bus> {
    return this.http.post<Bus>(this.base, body);
  }

  update(id: number, body: BusInput): Observable<Bus> {
    return this.http.put<Bus>(`${this.base}/${id}`, body);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
