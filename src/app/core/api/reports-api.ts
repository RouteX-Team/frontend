import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RouteUsageReport } from '../../shared/models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportsApi {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/reports';

  private range(from: string | null, to: string | null): HttpParams {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return params;
  }

  routeUsage(from: string | null, to: string | null): Observable<RouteUsageReport> {
    return this.http.get<RouteUsageReport>(`${this.base}/route-usage`, { params: this.range(from, to) });
  }

  exportRouteUsageCsv(from: string | null, to: string | null): Observable<Blob> {
    return this.http.get(`${this.base}/route-usage/export`, {
      params: this.range(from, to),
      responseType: 'blob',
    });
  }
}
