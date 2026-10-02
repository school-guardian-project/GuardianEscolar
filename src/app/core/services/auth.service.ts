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
  profileId?: string;
  personId?: string;
  email?: string;
}

export interface Session {
  profileId: string | null;
  personId: string | null;
  email: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly base = `${environment.apiUrl}/api/v1/auth`;

  private accessToken: string | null = null;
  private refreshInFlight: Observable<string> | null = null;
  private userSession: Session = { profileId: null, personId: null, email: null };

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  login(email: string, password: string): Observable<void> {
    return this.http
      .post<LoginResponse>(`${this.base}/login`, { email, password }, { withCredentials: true })
      .pipe(map((res) => { this.accessToken = res.accessToken; this.applySession(res); }));
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
            this.applySession(res);
            return res.accessToken;
          }),
          catchError((err) => {
            this.accessToken = null;
            this.userSession = { profileId: null, personId: null, email: null };
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
      .pipe(finalize(() => {
        this.accessToken = null;
        this.userSession = { profileId: null, personId: null, email: null };
      }));
  }

  /** Datos de la sesión del usuario logueado (profileId, personId, email). */
  get session(): Session {
    return this.userSession;
  }

  getToken(): string | null {
    return this.accessToken;
  }

  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }

  /** Claim `roleId` del JWT. Se decodifica sin verificar: la firma la valida el gateway. */
  get roleId(): number | null {
    const roleId = this.claims()['roleId'];
    return typeof roleId === 'number' ? roleId : null;
  }

  /**
   * Rellena la sesión desde la respuesta del backend y, en refresh, desde los
   * claims del JWT cuando el endpoint no repite los datos.
   */
  private applySession(res: Partial<LoginResponse>): void {
    const claims = this.claims();
    const pick = (key: keyof Session): string | null => {
      const fromRes = res[key];
      if (typeof fromRes === 'string' && fromRes) return fromRes;
      const fromClaims = claims[key];
      return typeof fromClaims === 'string' && fromClaims ? fromClaims : this.userSession[key];
    };
    this.userSession = { profileId: pick('profileId'), personId: pick('personId'), email: pick('email') };
  }

  private claims(): Record<string, unknown> {
    if (!this.accessToken) return {};
    try {
      const payload = this.accessToken.split('.')[1];
      return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    } catch {
      return {};
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
