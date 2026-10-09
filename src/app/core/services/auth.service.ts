import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, catchError, finalize, map, of, share, switchMap, throwError } from 'rxjs';
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
  campusId: string | null;
  schoolId: string | null;
}

interface RefreshResponse {
  accessToken: string;
  profileId?: string;
  personId?: string;
  email?: string;
  campusId?: string;
  schoolId?: string;
}

/**
 * Datos del usuario en sesion.
 *
 * `campusId` y `schoolId` no son intercambiables aunque ambos apunten a un id de
 * `School`: el primero es la sede a la que pertenece una persona (student,
 * driver, parent) y el segundo es el colegio que administra un admin. La sede se
 * usa para comparar rutas; el colegio, para acotar que estudiantes y que sedes
 * puede ver quien administra. Mandar uno donde se espera el otro produce un id
 * valido en forma que no existe en la tabla buscada, y el backend responde 400.
 */
export interface Session {
  profileId: string | null;
  personId: string | null;
  email: string | null;
  campusId: string | null;
  schoolId: string | null;
}

const EMPTY_SESSION: Session = {
  profileId: null,
  personId: null,
  email: null,
  campusId: null,
  schoolId: null,
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly base = `${environment.apiUrl}/api/v1/auth`;

  private accessToken: string | null = null;
  private refreshInFlight: Observable<string> | null = null;
  private userSession: Session = { ...EMPTY_SESSION };

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
          // El refresh token no lleva el correo: tras un F5 se recupera desde /profile.
          switchMap((token) => this.userSession.email ? of(token) : this.loadEmail(token)),
          catchError((err) => {
            this.accessToken = null;
            this.userSession = { ...EMPTY_SESSION };
            return throwError(() => err);
          }),
          finalize(() => { this.refreshInFlight = null; }),
          share(),
        );
    }
    return this.refreshInFlight;
  }

  private loadEmail(token: string): Observable<string> {
    return this.http
      .get<{ email?: string }>(`${this.base}/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .pipe(
        map((profile) => {
          if (profile.email) this.userSession = { ...this.userSession, email: profile.email };
          return token;
        }),
        catchError(() => of(token)),
      );
  }
  logout(): Observable<void> {
    const headers: Record<string, string> = this.accessToken
      ? { Authorization: `Bearer ${this.accessToken}` }
      : {};
    return this.http
      .post<void>(`${this.base}/logout`, null, { withCredentials: true, headers })
      .pipe(finalize(() => {
        this.accessToken = null;
        this.userSession = { ...EMPTY_SESSION };
      }));
  }

  /** Datos de la sesión del usuario logueado (profileId, personId, email). */
  get session(): Session {
    return this.userSession;
  }

  /** Refleja en la sesión un correo ya cambiado en el backend (el claim del JWT queda viejo hasta el próximo refresh). */
  updateSessionEmail(email: string): void {
    this.userSession = { ...this.userSession, email };
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
   * true si la sesión actual tiene alguno de los roles indicados. Es el filtro
   * que usan los menús: un elemento de navegación solo se muestra cuando el rol
   * de la sesión podría abrir la ruta a la que apunta.
   */
  hasRole(...roles: number[]): boolean {
    const roleId = this.roleId;
    return roleId !== null && roles.includes(roleId);
  }

  /**
   * Rellena la sesión desde la respuesta del backend y, en refresh, desde los
   * claims del JWT cuando el endpoint no repite los datos.
   */
  private applySession(res: Partial<LoginResponse>): void {
    const claims = this.claims();
    const pick = (key: keyof Session): string | null => {
      if (res[key] === null) return null;
      const fromRes = res[key];
      if (typeof fromRes === 'string' && fromRes) return fromRes;
      const fromClaims = key === 'profileId' ? claims['profileId'] ?? claims['sub'] : claims[key];
      return typeof fromClaims === 'string' && fromClaims ? fromClaims : null;
    };
    this.userSession = {
      profileId: pick('profileId'),
      personId: pick('personId'),
      email: pick('email'),
      campusId: pick('campusId'),
      schoolId: pick('schoolId'),
    };
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
