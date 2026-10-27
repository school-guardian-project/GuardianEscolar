import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../../../environments/environment';

import { AdminsService } from './admins.service';

describe('AdminsService', () => {
  let service: AdminsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AdminsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deletes the administrator using the user-management gateway route', () => {
    const complete = vi.fn();
    service.remove('admin-1').subscribe(complete);
    const request = http.expectOne(`${environment.apiUrl}/user/api/v1/admins/admin-1`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null, { status: 204, statusText: 'No Content' });
    expect(complete).toHaveBeenCalled();
  });
});
