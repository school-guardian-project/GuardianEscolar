import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BusesService } from './buses.service';
import { environment } from '../../../environments/environment';

describe('BusesService', () => {
  let service: BusesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(BusesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('changes the bus status with PATCH /buses/{id}/status (FR-3.8)', () => {
    service.changeStatus('bus-1', 'Inactive').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/fleet/api/buses/bus-1/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'Inactive' });
    req.flush(null);
  });
});
