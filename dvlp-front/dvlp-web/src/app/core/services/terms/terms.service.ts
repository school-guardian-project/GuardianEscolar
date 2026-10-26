import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface TermsAcceptance {
  id: string;
  termsVersion: string;
  studentProfileId: string | null;
  acceptedAt: string;
}

export interface TermsStatus {
  accepted: boolean;
  termsVersion: string;
  ownAccepted: boolean;
  minorsPending: Array<{ profileId: string; name: string }>;
}

export interface PendingAcceptance {
  termsVersion: string;
  ownMissing: boolean;
  minors: Array<{ profileId: string; name: string }>;
}

@Injectable({ providedIn: 'root' })
export class TermsService {
  private readonly base = `${environment.apiUrl}/api/v1/auth/terms`;

  constructor(private http: HttpClient) {}

  /** Obtiene el historial de aceptaciones del usuario autenticado. */
  getAcceptances(): Observable<TermsAcceptance[]> {
    return this.http.get<TermsAcceptance[]>(`${this.base}/acceptances`);
  }

  /** Obtiene el estado de la versión vigente de términos. */
  getStatus(): Observable<TermsStatus> {
    return this.http.get<TermsStatus>(`${this.base}/status`);
  }

  /** Registra la aceptación de una versión de los Términos. */
  accept(termsVersion: string, studentProfileIds: string[] = []): Observable<void> {
    return this.http.post<void>(`${this.base}/accept`, { termsVersion, studentProfileIds });
  }

  /** Calcula qué aceptaciones faltan para la versión vigente. */
  getPending(): Observable<PendingAcceptance> {
    return this.http.get<PendingAcceptance>(`${this.base}/pending`);
  }
}