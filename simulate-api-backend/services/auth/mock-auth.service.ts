// [MOCK-API] Auth simulado — validado, mensajes genéricos, DTO
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap, map, throwError } from 'rxjs';
import { MockApiService } from './mock-api.service';
import { MOCK_ENDPOINTS } from './mock-api.config';
import { validateEmail, validatePassword } from './mock-api.validators';
import { MockApiError } from './mock-api.errors';

export interface MockLoginResult {
  person: { id: string; email: string; name: string };
  profile: { id: string; roleId: number };
  roleName: string;
  appRole: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class MockAuthService {
  private api = inject(MockApiService);

  login(email: string, password: string): Observable<MockLoginResult> {
    let safeEmail: string;
    try {
      safeEmail = validateEmail(email);
      validatePassword(password);
    } catch (e: any) {
      return throwError(() => e);
    }

    return this.api.get<any[]>(MOCK_ENDPOINTS.persons, { Email: safeEmail }).pipe(
      switchMap((persons) => {
        const person = persons[0];
        if (!person) return throwError(() => new MockApiError('Credenciales inválidas.', 401, null));
        return this.api.get<any[]>(MOCK_ENDPOINTS.profiles, { PersonId: person.Id }).pipe(
          map((profiles) => ({ person, profile: profiles[0] }))
        );
      }),
      switchMap(({ person, profile }) => {
        if (!profile) return throwError(() => new MockApiError('No se pudo completar el inicio de sesión.', 401, null));
        return this.api.get<any[]>(MOCK_ENDPOINTS.roles, { ID: profile.RoleId } as any).pipe(
          map((roles) => {
            const role = roles[0];
            if (!role?.Name) throw new MockApiError('No se pudo completar el inicio de sesión.', 500, null);
            const roleName = String(role.Name).toLowerCase();
            const map: Record<string, string> = { admin: 'admin', student: 'student', parent: 'parent', driver: 'driver' };
            return {
              person: { id: person.Id, email: person.Email, name: `${person.Name} ${person.LastName}`.trim() },
              profile: { id: profile.Id, roleId: profile.RoleId },
              roleName,
              appRole: map[roleName] ?? roleName,
              token: `mock-jwt-${profile.Id}-${Date.now()}`,
            };
          })
        );
      })
    );
  }
}
