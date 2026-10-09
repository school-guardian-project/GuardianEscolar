import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface TokenResponse {
  resetToken: string;
}

/**
 * Flujo de cambio de correo: 1) código al correo actual, 2) verificarlo, 3) indicar el correo nuevo
 * (se envía un código ahí), 4) verificar ese código y confirmar el cambio.
 */
@Injectable({ providedIn: 'root' })
export class ChangeEmailService {
  private readonly base = `${(
    environment.forgotInformationApiUrl || environment.apiUrl || ''
  ).replace(/\/+$/, '')}/api/v1/email/change`;

  private currentEmail: string | null = null;
  private currentToken: string | null = null;
  private newEmail: string | null = null;

  constructor(private readonly http: HttpClient) {}

  request(email: string): Observable<void> {
    this.clear();
    const normalized = email.trim().toLowerCase();
    return this.http.post<void>(`${this.base}/request`, { email: normalized }).pipe(
      tap(() => { this.currentEmail = normalized; }),
    );
  }

  resendCurrent(): Observable<void> {
    return this.http.post<void>(`${this.base}/request`, { email: this.requireEmail() });
  }

  resendNew(): Observable<void> {
    return this.http.post<void>(`${this.base}/resend-new`, { email: this.requireEmail() });
  }

  verifyCurrent(code: string): Observable<void> {
    return this.http.post<TokenResponse>(`${this.base}/verify`, { email: this.requireEmail(), code }).pipe(
      tap((r) => { this.currentToken = r.resetToken; }),
      map(() => undefined),
    );
  }

  submitNewEmail(newEmail: string): Observable<void> {
    const normalized = newEmail.trim().toLowerCase();
    const body = { email: this.requireEmail(), resetToken: this.currentToken, newEmail: normalized };
    return this.http.post<void>(`${this.base}/new`, body).pipe(
      tap(() => {
        this.newEmail = normalized;
        this.currentToken = null;
      }),
    );
  }

  /** Verifica el código del correo nuevo y aplica el cambio. Devuelve el correo nuevo. */
  verifyNewAndConfirm(code: string): Observable<string> {
    const email = this.requireEmail();
    const newEmail = this.newEmail;
    return this.http.post<TokenResponse>(`${this.base}/verify-new`, { email, code }).pipe(
      switchMap((r) => this.http.post<void>(`${this.base}/confirm`, { email, resetToken: r.resetToken })),
      map(() => newEmail ?? ''),
      tap(() => this.clear()),
    );
  }

  get hasRequested(): boolean { return this.currentEmail !== null; }
  get hasVerifiedCurrent(): boolean { return this.currentEmail !== null && this.currentToken !== null; }
  get hasSubmittedNew(): boolean { return this.currentEmail !== null && this.newEmail !== null; }

  clear(): void {
    this.currentEmail = null;
    this.currentToken = null;
    this.newEmail = null;
  }

  private requireEmail(): string {
    if (!this.currentEmail) {
      throw new Error('An email change must be requested first.');
    }
    return this.currentEmail;
  }
}