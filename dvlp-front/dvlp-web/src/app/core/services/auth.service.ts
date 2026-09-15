import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, map, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = `${environment.apiUrl}/api`;
    private isMock = environment.apiUrl.includes(':3000');
    
    constructor(private http: HttpClient) {}

    login(email: string, password: string): Observable<any> {
        // [MOCK-API] Si apunta a json-server :3000, simula flujo persons→profiles→roles (compatible con movil)
        if (this.isMock) {
            return this.mockLogin(email, password);
        }
        return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
            tap((response: any) => {
                localStorage.setItem('access_token', response.accessToken);
                localStorage.setItem('user_name', response.name);
                localStorage.setItem('user_email', response.email);
                localStorage.setItem('user_roles', JSON.stringify(response.roles));
            })
        );
    }

    // [MOCK-API] Login contra json-server :3000 — usa endpoints reales de db.json/openapi.json
    private mockLogin(email: string, password: string): Observable<any> {
        if (!email || !password) return throwError(() => new Error('Correo y contraseña requeridos'));
        const base = environment.apiUrl; // http://localhost:3000
        return this.http.get<any[]>(`${base}/persons`, { params: new HttpParams().set('Email', email) }).pipe(
            switchMap((persons) => {
                const person = persons[0];
                if (!person) return throwError(() => new Error('Credenciales inválidas'));
                return this.http.get<any[]>(`${base}/profiles`, { params: new HttpParams().set('PersonId', person.Id) }).pipe(
                    map((profiles) => ({ person, profile: profiles[0] }))
                );
            }),
            switchMap(({ person, profile }) => {
                if (!profile) return throwError(() => new Error('Perfil no encontrado'));
                // [MOCK-API] Validar contraseña: compara hash generado con el almacenado
                const hash = profile.PasswordHash || '';
                if (hash.startsWith('AQAAAAEAACcQAAAAE')) {
                    const expected = `AQAAAAEAACcQAAAAE${btoa(password).slice(0, 20)}==`;
                    if (hash !== expected) {
                        return throwError(() => new Error('Credenciales inválidas. Verifica tu correo y contraseña.'));
                    }
                }
                // $2b$10$demo.hash... = hash legacy de demo, acepta cualquier contraseña
                return this.http.get<any[]>(`${base}/roles`, { params: new HttpParams().set('ID', profile.RoleId) }).pipe(
                    map((roles) => {
                        const role = roles[0];
                        const roleName = (role?.Name ?? '').toLowerCase();
                        const token = `mock-jwt-${profile.Id}-${Date.now()}`;
                        const response = {
                            accessToken: token,
                            personId: person.Id,
                            name: `${person.Name} ${person.LastName}`.trim(),
                            email: person.Email,
                            roles: [roleName],
                        };
                        return response;
                    })
                );
            }),
            tap((response: any) => {
                localStorage.setItem('access_token', response.accessToken);
                if (response.personId) localStorage.setItem('user_person_id', response.personId);
                localStorage.setItem('user_name', response.name);
                localStorage.setItem('user_email', response.email);
                localStorage.setItem('user_roles', JSON.stringify(response.roles));
                console.log('[MOCK-API] Cliente -> json-server :3000 -> DB login OK', response.email, response.roles);
            })
        );
    }

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) {
            return false;
        }
        return true;
    }

    logout(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_person_id');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_roles');
    }
}