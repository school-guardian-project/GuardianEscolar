import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, catchError, finalize, map, share, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export const ROLES = {
  ADMIN: 1,
  STUDENT: 2,
  DRIVER: 3,
  PARENT: 4,
  SUPER_ADMIN: 5,
} as const;

interface LoginResponse {
  accessToken: string;
  profileId: string;
  personId: string;
  email: string;
  roleId: number | null;
}

interface RefreshResponse {
  accessToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly base = `${environment.apiUrl}/api/v1/auth`;

  private accessToken: string | null = null;
  private refreshInFlight: Observable<string> | null = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  login(email: string, password: string): Observable<void> {
    return this.http
      .post<LoginResponse>(`${this.base}/login`, { email, password }, { withCredentials: true })
      .pipe(map((res) => { this.accessToken = res.accessToken; }));
  }

  /** Single-flight: varias llamadas concurrentes comparten una sola rotación. */
  refresh(): Observable<string> {
    if (!isPlatformBrowser(this.platformId)) {
      return throwError(() => new Error('refresh is only available in the browser'));
    }
    if (!this.refreshInFlight) {
      this.refreshInFlight = this.http
        .post<RefreshResponse>(`${this.base}/refresh`, null, { withCredentials: true })
        .pipe(
          map((res) => {
            this.accessToken = res.accessToken;
            return res.accessToken;
          }),
          catchError((err) => {
            this.accessToken = null;
            return throwError(() => err);
          }),
          finalize(() => { this.refreshInFlight = null; }),
          share(),
        );
    }
    return this.refreshInFlight;
  }

  logout(): Observable<void> {
    const headers: Record<string, string> = this.accessToken
      ? { Authorization: `Bearer ${this.accessToken}` }
      : {};
    return this.http
      .post<void>(`${this.base}/logout`, null, { withCredentials: true, headers })
      .pipe(finalize(() => { this.accessToken = null; }));
  }

  getToken(): string | null {
    return this.accessToken;
  }

  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }

  /** Claim `roleId` del JWT. Se decodifica sin verificar: la firma la valida el gateway. */
  get roleId(): number | null {
    if (!this.accessToken) {
      return null;
    }
    try {
      const payload = this.accessToken.split('.')[1];
      const decoded: unknown = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      const roleId = (decoded as { roleId?: unknown }).roleId;
      return typeof roleId === 'number' ? roleId : null;
    } catch {
      return null;
    }
  }

  homeRoute(): string {
    switch (this.roleId) {
      case ROLES.SUPER_ADMIN:
        return '/dashboard-superadmin';
      case ROLES.ADMIN:
        return '/dashboard-admin';
      default:
        return '/home';
    }
  }
}
