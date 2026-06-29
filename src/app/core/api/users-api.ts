import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserRole } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class UsersApi {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/users';

  getAll(role?: UserRole): Observable<User[]> {
    let params = new HttpParams();
    if (role) params = params.set('role', role);
    return this.http.get<User[]>(this.base, { params });
  }

  updateRole(id: number, role: UserRole): Observable<User> {
    return this.http.put<User>(`${this.base}/${id}/role`, { role });
  }

  updateStatus(id: number, isActive: boolean): Observable<User> {
    return this.http.put<User>(`${this.base}/${id}/status`, { isActive });
  }
}
