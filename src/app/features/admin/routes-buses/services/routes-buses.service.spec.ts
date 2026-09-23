import { TestBed } from '@angular/core/testing';

import { RoutesBusesService } from './routes-buses.service';

describe('RoutesBusesService', () => {
  let service: RoutesBusesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoutesBusesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
