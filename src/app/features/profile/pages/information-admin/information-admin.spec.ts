import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { InformationAdmin } from './information-admin';

const profile = {
  profileId: 'profile-current', personId: 'person-current', email: 'current@example.invalid',
  roleId: 1, roleName: 'Admin', campusId: null, campusName: null,
  schoolId: 'school-current', schoolName: 'Current School',
  name: 'Current', lastName: 'User', status: 'Active', cityName: 'Current City',
};
const person = {
  id: 'person-current', name: 'Current', lastName: 'User',
  email: 'current@example.invalid', phone: 3001234567,
  identificationType: 'CC', identificationNumber: '123456789',
  residenceAddress: 'Current Address', dateBirth: '1990-05-10',
};

describe('InformationAdmin', () => {
  let http: HttpTestingController;
  let component: InformationAdmin;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationAdmin],
      providers: [
        provideHttpClient(), provideHttpClientTesting(),
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
        { provide: AuthService, useValue: { session: { personId: 'stale-person' }, roleId: 1 } },
      ],
    }).overrideComponent(InformationAdmin, {
      set: { imports: [], template: '{{ name }} {{ phone }} {{ city }} {{ school }}' },
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(InformationAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('loads the authenticated person, not a stale session ID, and shows all details', () => {
    expect(component.loading).toBe(true);
    http.expectOne(req => req.url.endsWith('/auth/profile')).flush(profile);
    http.expectOne(req => req.url.endsWith('/admins/person-current')).flush(person);
    expect(component.name).toBe('Current User');
    expect(component.phone).toBe('3001234567');
    expect(component.email).toBe('current@example.invalid');
    expect(component.id).toBe('123456789');
    expect(component.address).toBe('Current Address');
    expect(component.dateBirth).toBe('1990-05-10');
    expect(component.city).toBe('Current City');
    expect(component.school).toBe('Current School');
    expect(component.loading).toBe(false);
    expect(component.loadFailed).toBe(false);
  });

  it('keeps IAM details visible and allows retry after personal details fail', () => {
    http.expectOne(req => req.url.endsWith('/auth/profile')).flush(profile);
    http.expectOne(req => req.url.endsWith('/admins/person-current'))
      .flush(null, { status: 500, statusText: 'Server Error' });
    expect(component.loadFailed).toBe(true);
    expect(component.loading).toBe(false);
    expect(component.name).toBe('Current User');
    expect(component.city).toBe('Current City');
    component.loadProfile();
    expect(component.loadFailed).toBe(false);
    http.expectOne(req => req.url.endsWith('/auth/profile')).flush(profile);
    http.expectOne(req => req.url.endsWith('/admins/person-current')).flush(person);
    expect(component.phone).toBe('3001234567');
    expect(component.loadFailed).toBe(false);
  });

  it('reports an IAM error without querying another user', () => {
    http.expectOne(req => req.url.endsWith('/auth/profile'))
      .flush(null, { status: 401, statusText: 'Unauthorized' });
    http.expectNone(req => req.url.includes('/admins/'));
    expect(component.loadFailed).toBe(true);
    expect(component.loading).toBe(false);
    expect(component.user).toBeNull();
  });

  it('reports an empty personal details response', () => {
    http.expectOne(req => req.url.endsWith('/auth/profile')).flush(profile);
    http.expectOne(req => req.url.endsWith('/admins/person-current')).flush(null);
    expect(component.loadFailed).toBe(true);
    expect(component.name).toBe('Current User');
  });
});
