import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BusesService } from './buses.service';

describe('BusesService', () => {
  let service: BusesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(BusesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
