import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface VerifyPasswordResetResponse {
  resetToken: string;
}

@Injectable({ providedIn: 'root' })
export class ForgotInformationService {
  private readonly base = `${(
    environment.forgotInformationApiUrl || environment.apiUrl || ''
  ).replace(/\/+$/, '')}/api/v1/password`;

  private email: string | null = null;
  private resetToken: string | null = null;

  constructor(private readonly http: HttpClient) {}

  requestPasswordReset(email: string): Observable<void> {
    this.clear();
    const normalized = email.trim().toLowerCase();
    return this.http.post<void>(`${this.base}/forgot`, { email: normalized }).pipe(
      tap(() => {
        this.email = normalized;
        this.resetToken = null;
      }),
    );
  }

  verifyPasswordResetCode(code: string): Observable<void> {
    if (!this.email) {
      throw new Error('A password reset must be requested before verifying a code.');
    }

    return this.http.post<VerifyPasswordResetResponse>(`${this.base}/forgot/verify`, { email: this.email, code }).pipe(
      tap((response) => {
        this.resetToken = response.resetToken;
      }),
      map(() => undefined),
    );
  }

  resetPassword(newPassword: string, confirmPassword: string): Observable<void> {
    if (!this.email || !this.resetToken) {
      throw new Error('A verified password reset code is required before resetting the password.');
    }

    const body = {
      email: this.email,
      resetToken: this.resetToken,
      newPassword,
      confirmPassword,
    };

    return this.http.post<void>(`${this.base}/reset`, body).pipe(tap(() => this.clear()));
  }

  get hasRequestedReset(): boolean {
    return this.email !== null;
  }

  get hasVerifiedResetCode(): boolean {
    return this.email !== null && this.resetToken !== null;
  }

  clear(): void {
    this.email = null;
    this.resetToken = null;
  }
}
