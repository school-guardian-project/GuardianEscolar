import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthService } from './auth.service';

function jwt(claims: Record<string, unknown>): string {
  const enc = (o: Record<string, unknown>) => btoa(JSON.stringify(o)).replace(/=/g, '');
  return `${enc({ alg: 'none' })}.${enc(claims)}.firma`;
}

describe('AuthService session', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('guarda profileId/personId/email desde la respuesta de login', () => {
    let done = false;
    service.login('admin@school.com', 'secret').subscribe(() => (done = true));

    httpMock
      .expectOne((req) => req.url.endsWith('/login'))
      .flush({
        accessToken: jwt({ roleId: 1 }),
        profileId: '10',
        personId: '20',
        email: 'admin@school.com',
      });

    expect(done).toBe(true);
    expect(service.session).toEqual({ profileId: '10', personId: '20', email: 'admin@school.com', campusId: null, schoolId: null });
    expect(service.roleId).toBe(1);
  });

  it('si la respuesta no trae la sesión, la toma de los claims del JWT', () => {
    service.login('admin@school.com', 'secret').subscribe();

    httpMock
      .expectOne((req) => req.url.endsWith('/login'))
      .flush({
        accessToken: jwt({ roleId: 5, profileId: '30', personId: '40', email: 'sa@school.com' }),
      });

    expect(service.session).toEqual({ profileId: '30', personId: '40', email: 'sa@school.com', campusId: null, schoolId: null });
    expect(service.roleId).toBe(5);
  });

  it('limpia la sesión al hacer logout', () => {
    service.login('admin@school.com', 'secret').subscribe();
    httpMock.expectOne((req) => req.url.endsWith('/login')).flush({
      accessToken: jwt({ roleId: 1 }),
      profileId: '10',
      personId: '20',
      email: 'admin@school.com',
    });

    service.logout().subscribe();
    httpMock.expectOne((req) => req.url.endsWith('/logout')).flush(null);

    expect(service.session).toEqual({ profileId: null, personId: null, email: null, campusId: null, schoolId: null });
  });

  it('uses the existing school claim and clears it when a later session has no school', () => {
    service.login('admin@school.com', 'secret').subscribe();
    httpMock.expectOne((req) => req.url.endsWith('/login')).flush({
      accessToken: jwt({ roleId: 1, schoolId: 'school-id', campusId: 'campus-id' }),
    });
    expect(service.session.schoolId).toBe('school-id');
    expect(service.session.campusId).toBe('campus-id');

    service.login('superadmin@school.com', 'secret').subscribe();
    httpMock.expectOne((req) => req.url.endsWith('/login')).flush({
      accessToken: jwt({ roleId: 5 }),
    });
    expect(service.session.schoolId).toBeNull();
    expect(service.session.campusId).toBeNull();
  });

  it('recovers profileId from the actual JWT subject during refresh', () => {
    service.refresh().subscribe();
    httpMock.expectOne((req) => req.url.endsWith('/refresh')).flush({
      accessToken: jwt({ sub: 'profile-id', personId: 'person-id', email: 'admin@school.com', roleId: 1, schoolId: 'school-id' }),
    });
    expect(service.session.profileId).toBe('profile-id');
    expect(service.session.schoolId).toBe('school-id');
    expect(service.session.campusId).toBeNull();
  });
});
