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

/**
 * Catálogo de permisos RBAC (FR-2.1). Es el espejo en el cliente de las filas de
 * `Iam.Permissions`; evita strings sueltos en los menús y los guards. El backend
 * es la fuente de verdad: aquí solo se usan para decidir qué mostrar.
 */
export const PERMISSIONS = {
  SCHOOLS_READ: 'schools.read',
  SCHOOLS_CREATE: 'schools.create',
  SCHOOLS_UPDATE: 'schools.update',
  STUDENTS_READ: 'students.read',
  STUDENTS_MANAGE: 'students.manage',
  ROUTES_READ: 'routes.read',
  ROUTES_MANAGE: 'routes.manage',
  BUSES_READ: 'buses.read',
  BUSES_MANAGE: 'buses.manage',
  DRIVERS_READ: 'drivers.read',
  DRIVERS_MANAGE: 'drivers.manage',
  ALERTS_READ: 'alerts.read',
  ALERTS_ACK: 'alerts.ack',
  BOARDING_READ: 'boarding.read',
  BOARDING_MANAGE: 'boarding.manage',
  USERS_READ: 'users.read',
  USERS_MANAGE: 'users.manage',
  REPORTS_READ: 'reports.read',
  SETTINGS_MANAGE: 'settings.manage',
  AUDIT_READ: 'audit.read',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

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
  private readonly TOKEN_KEY = 'sg_access_token';

  private accessToken: string | null = null;
  private refreshInFlight: Observable<string> | null = null;
  private userSession: Session = { ...EMPTY_SESSION };

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.accessToken = localStorage.getItem(this.TOKEN_KEY);
    }
  }

  login(email: string, password: string): Observable<void> {
    return this.http
      .post<LoginResponse>(`${this.base}/login`, { email, password }, { withCredentials: true })
      .pipe(map((res) => { 
        this.accessToken = res.accessToken; 
        this.persistToken();
        this.applySession(res); 
      }));
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
            this.persistToken();
            this.applySession(res);
            return res.accessToken;
          }),
          // El refresh token no lleva el correo: tras un F5 se recupera desde /profile.
          switchMap((token) => this.userSession.email ? of(token) : this.loadEmail(token)),
          catchError((err) => {
            this.accessToken = null;
            this.persistToken();
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
        this.persistToken();
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

  updateSessionSchoolId(schoolId: string | null): void {
    this.userSession = { ...this.userSession, schoolId };
  }

  getToken(): string | null {
    return this.accessToken;
  }

  private persistToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.accessToken) {
        localStorage.setItem(this.TOKEN_KEY, this.accessToken);
      } else {
        localStorage.removeItem(this.TOKEN_KEY);
      }
    }
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

  /** Claim `role` del JWT: nombre legible del rol (p. ej. "Admin"). */
  get roleName(): string | null {
    const role = this.claims()['role'];
    return typeof role === 'string' && role ? role : null;
  }

  /** Claim `documentNumber` del JWT: número de identificación de la persona (FR-2.1). */
  get identificationNumber(): string | null {
    const documentNumber = this.claims()['documentNumber'];
    return typeof documentNumber === 'string' && documentNumber ? documentNumber : null;
  }

  /** Claim `permissions` del JWT: permisos RBAC concedidos (FR-2.1). */
  get permissions(): string[] {
    const permissions = this.claims()['permissions'];
    if (!Array.isArray(permissions)) return [];
    return permissions.filter((permission): permission is string => typeof permission === 'string');
  }

  /**
   * true si la sesión tiene alguno de los permisos indicados. Espeja `hasRole`:
   * los menús y botones lo usan para no ofrecer acciones que el backend
   * rechazaría con 403. Sin permisos concedidos siempre devuelve false.
   */
  hasPermission(...permissions: string[]): boolean {
    if (permissions.length === 0) return false;
    const granted = this.permissions;
    return permissions.some((permission) => granted.includes(permission));
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
