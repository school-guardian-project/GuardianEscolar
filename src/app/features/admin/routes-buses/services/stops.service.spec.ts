import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StopsService } from './stops.service';

describe('StopsService', () => {
  let service: StopsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(StopsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
