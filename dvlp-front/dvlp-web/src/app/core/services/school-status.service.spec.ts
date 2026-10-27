import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SchoolsService } from './schools.service';
import { CampusesService } from './campuses.service';
import { environment } from '../../../environments/environment';

describe('school and campus status requests', () => {
  let http: HttpTestingController;
  const base = `${environment.apiUrl}/school-management/api/v1`;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('keeps assignment lists active-only and explicitly includes inactive campuses for management', () => {
    const service = TestBed.inject(CampusesService);
    service.listBySchool('school-1').subscribe();
    const activeRequest = http.expectOne(`${base}/schools/school-1/campuses`);
    expect(activeRequest.request.method).toBe('GET');
    expect(activeRequest.request.urlWithParams).not.toContain('includeInactive');
    activeRequest.flush([]);
    service.listBySchool('school-1', true).subscribe();
    const managementRequest = http.expectOne(`${base}/schools/school-1/campuses?includeInactive=true`);
    expect(managementRequest.request.method).toBe('GET');
    expect(managementRequest.request.urlWithParams).toContain('includeInactive=true');
    managementRequest.flush([]);
  });

  it('reactivates a school without changing the saved contact or location fields', () => {
    TestBed.inject(SchoolsService).reactivate('school-1').subscribe();
    http.expectOne(`${base}/schools/school-1`).flush({
      id: 'school-1', name: 'School', cityId: 'city-1', cityName: 'City', logo: '',
      address: 'Main street', phone: 3001234567, email: 'school@test.com',
      latitude: 4.5, longitude: -74, website: '', theme: 'Primaria', status: 'Inactive',
    });
    const request = http.expectOne(`${base}/schools/school-1`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({
      name: 'School', cityId: 'city-1', logo: '', address: 'Main street',
      phone: 3001234567, email: 'school@test.com', latitude: 4.5, longitude: -74,
      website: '', theme: 'Primaria', status: 'Active',
    });
    request.flush(null, { status: 204, statusText: 'No Content' });
  });
});
