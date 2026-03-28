import { TestBed } from '@angular/core/testing';

import { RoutesBuses } from './routes-buses';

describe('RoutesBuses', () => {
  let service: RoutesBuses;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoutesBuses);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
