// [MOCK-API] Servicio para cambiar email/teléfono/contraseña — Cliente -> :3000 -> DB
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap, map, tap, Subject, of } from 'rxjs';
import { MockApiService } from './mock-api.service';
import { clearMockCache } from './mock-api.cache';

@Injectable({ providedIn: 'root' })
export class ProfileUpdateService {
  private api = inject(MockApiService);
  private refreshSubject = new Subject<void>();
  refresh$ = this.refreshSubject.asObservable();
  private emitRefresh(): void { this.refreshSubject.next(); }
  // Para que se vea sin F5: guarda el último person actualizado y lo expone

  // Estado temporal para flujos multi-paso (email/telefono) — no persiste
  private pendingEmail: string | null = null;
  private pendingPhone: string | null = null;
  setPendingEmail(v: string) { this.pendingEmail = v; }
  getPendingEmail(): string | null { return this.pendingEmail; }
  setPendingPhone(v: string) { this.pendingPhone = v; }
  getPendingPhone(): string | null { return this.pendingPhone; }
  clearPending() { this.pendingEmail = null; this.pendingPhone = null; }

  private currentPersonId$(): Observable<string> {
    const personId = localStorage.getItem('user_person_id');
    if (personId) return of(personId);
    const email = localStorage.getItem('user_email') || 'ejemplo@gmail.com';
    return this.api.get<any[]>('/persons', { Email: email }).pipe(
      switchMap((arr) => {
        if (arr[0]?.Id) return of(arr[0].Id);
        return this.api.get<any[]>('/persons', { Email: 'ejemplo@gmail.com' }).pipe(
          map(fallback => fallback[0]?.Id ?? '')
        );
      })
    );
  }

  updateEmail(newEmail: string): Observable<any> {
    const email = newEmail || this.pendingEmail;
    if (!email) throw new Error('Email requerido');
    return this.currentPersonId$().pipe(
      switchMap(personId => this.api.get<any[]>('/persons', { Id: personId }).pipe(map(a => a[0]))),
      switchMap(person => {
        if (!person) throw new Error('Persona no encontrada');
        const merged = { ...person, Email: email, id: person.id ?? person.Id, Id: person.Id ?? person.id };
        return this.api.put<any>(`/persons/${merged.id}`, merged);
      }),
      tap(() => {
        localStorage.setItem('user_email', email!);
        clearMockCache();
        this.emitRefresh();
        // Actualiza también el objeto en memoria para que el siguiente GET no cachee viejo
        (this as any)._lastUpdatedEmail = email;
      })
    );
  }

  updatePhone(newPhone: string): Observable<any> {
    const phone = newPhone || this.pendingPhone;
    if (!phone) throw new Error('Teléfono requerido');
    const clean = String(phone).replace(/\D/g, '');
    return this.currentPersonId$().pipe(
      switchMap(pid => this.api.get<any[]>('/persons', { Id: pid }).pipe(map(a => a[0]))),
      switchMap(person => {
        if (!person) throw new Error('Persona no encontrada');
        const merged = { ...person, Phone: Number(clean) || clean, id: person.id ?? person.Id, Id: person.Id ?? person.id };
        return this.api.put<any>(`/persons/${merged.id}`, merged);
      }),
      tap(() => { clearMockCache(); this.emitRefresh(); })
    );
  }

  updatePassword(newPassword: string): Observable<any> {
    if (!newPassword || newPassword.length < 6) throw new Error('Contraseña muy corta');
    // En json-server la contraseña está en profiles.PasswordHash — para demo generamos hash mock compatible
    // El backend real usa PasswordHasher (PBKDF2), aquí guardamos el texto hasheado simulado
    const fakeHash = `AQAAAAEAACcQAAAAE${btoa(newPassword).slice(0, 20)}==`; // no se valida en mock, solo se guarda
    return this.currentPersonId$().pipe(
      switchMap(pid => this.api.get<any[]>('/profiles', { PersonId: pid }).pipe(map(a => a[0]))),
      switchMap(profile => {
        if (!profile) throw new Error('Perfil no encontrado');
        const merged = { ...profile, PasswordHash: fakeHash, id: profile.id ?? profile.Id, Id: profile.Id ?? profile.id };
        return this.api.put<any>(`/profiles/${merged.id}`, merged);
      }),
      tap(() => { clearMockCache(); this.emitRefresh(); })
    );
  }
}
