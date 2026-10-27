import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AlertsService } from './alerts.service';

describe('AlertsService', () => {
  let service: AlertsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AlertsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('sends school, catalog type, search and pagination filters to the API', () => {
    service.getAlerts({ schoolId: 'school-1', alertTypeId: 1, search: 'demora', page: 2 }).subscribe();
    const request = http.expectOne(req => req.url.endsWith('/notifications/alerts'));
    expect(request.request.params.get('schoolId')).toBe('school-1');
    expect(request.request.params.get('alertTypeId')).toBe('1');
    expect(request.request.params.get('search')).toBe('demora');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('size')).toBe('10');
    expect(request.request.params.get('sort')).toBe('timestamp,desc');
    request.flush({ content: [], totalElements: 0, totalPages: 0, size: 10, number: 2 });
  });

  it('loads types from the database catalog endpoint', () => {
    service.getAlertTypes().subscribe(types => expect(types).toEqual([{ id: 1, name: 'Bus Delay' }]));
    http.expectOne(req => req.url.endsWith('/notifications/alert-types'))
      .flush([{ id: 1, name: 'Bus Delay' }]);
  });
});
