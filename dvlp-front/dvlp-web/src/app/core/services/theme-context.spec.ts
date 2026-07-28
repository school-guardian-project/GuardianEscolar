import { TestBed } from '@angular/core/testing';

import { ThemeContext } from './theme-context';

describe('ThemeContext', () => {
  let service: ThemeContext;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeContext);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
