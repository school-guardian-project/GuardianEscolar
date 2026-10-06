import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface TokenResponse {
  resetToken: string;
}

/**
 * Flujo de cambio de teléfono (ambos códigos por SMS con Twilio Verify, números en E.164):
 * 1) SMS al teléfono ACTUAL, 2) verificarlo, 3) indicar el teléfono nuevo (SMS ahí), 4) verificar y confirmar.
 */
@Injectable({ providedIn: 'root' })
export class ChangePhoneService {
  private readonly base = `${(
    environment.forgotInformationApiUrl || environment.apiUrl || ''
  ).replace(/\/+$/, '')}/api/v1/phone/change`;

  private currentEmail: string | null = null;
  private currentPhone: string | null = null;
  private currentToken: string | null = null;
  private newPhone: string | null = null;

  constructor(private readonly http: HttpClient) {}

  /** `email` identifica el perfil (sesión); `currentPhone` es el teléfono actual, al que se envía el SMS. */
  request(email: string, currentPhone: string): Observable<void> {
    this.clear();
    const normalized = email.trim().toLowerCase();
    const phone = currentPhone.replace(/[\s-]/g, '');
    return this.http.post<void>(`${this.base}/request`, { email: normalized, currentPhone: phone }).pipe(
      tap(() => {
        this.currentEmail = normalized;
        this.currentPhone = phone;
      }),
    );
  }

  verifyIdentity(code: string): Observable<void> {
    const body = { email: this.requireEmail(), currentPhone: this.currentPhone, code };
    return this.http.post<TokenResponse>(`${this.base}/verify`, body).pipe(
      tap((r) => { this.currentToken = r.resetToken; }),
      map(() => undefined),
    );
  }

  /** Pide a Twilio Verify enviar el SMS al teléfono nuevo (+país + número). */
  requestSms(newPhone: string): Observable<void> {
    const normalized = newPhone.replace(/[\s-]/g, '');
    const body = { email: this.requireEmail(), resetToken: this.currentToken, newPhone: normalized };
    return this.http.post<void>(`${this.base}/verification/request`, body).pipe(
      tap(() => {
        this.newPhone = normalized;
        this.currentToken = null;
      }),
    );
  }

  /** Verifica el código SMS; el backend solo actualiza el teléfono si Twilio lo aprueba. */
  checkSms(code: string): Observable<void> {
    const body = { email: this.requireEmail(), newPhone: this.newPhone, code };
    return this.http.post<void>(`${this.base}/verification/check`, body).pipe(
      tap(() => this.clear()),
    );
  }

  get hasRequested(): boolean { return this.currentEmail !== null; }
  get hasVerifiedIdentity(): boolean { return this.currentEmail !== null && this.currentToken !== null; }
  get hasRequestedSms(): boolean { return this.currentEmail !== null && this.newPhone !== null; }

  clear(): void {
    this.currentEmail = null;
    this.currentPhone = null;
    this.currentToken = null;
    this.newPhone = null;
  }

  private requireEmail(): string {
    if (!this.currentEmail) {
      throw new Error('A phone change must be requested first.');
    }
    return this.currentEmail;
  }
}