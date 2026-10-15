import { TestBed } from '@angular/core/testing';
import { provideRouter, Route } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { of } from 'rxjs';

import { roleGuard } from './role.guard';
import { AuthService } from '@core/services/auth.service';

describe('roleGuard', () => {
  function run(route: Route, auth: Partial<AuthService>): unknown {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: AuthService, useValue: auth },
      ],
    });
    return TestBed.runInInjectionContext(() => roleGuard(route, []));
  }

  it('allows the route when the role matches', () => {
    const result = run({ data: { roles: [1] } }, { isAuthenticated: () => true, hasRole: () => true });
    expect(result).toBe(true);
  });

  it('redirects when the role does not match', () => {
    const result = run({ data: { roles: [5] } }, { isAuthenticated: () => true, hasRole: () => false });
    expect(result).not.toBe(true);
  });

  it('redirects when data.permissions are missing even if data.roles match', () => {
    const auth = { isAuthenticated: () => true, hasRole: () => true, hasPermission: () => false };
    expect(run({ data: { roles: [1], permissions: ['students.read'] } }, auth)).not.toBe(true);
  });

  it('allows the route when both data.roles and data.permissions match', () => {
    const auth = { isAuthenticated: () => true, hasRole: () => true, hasPermission: () => true };
    expect(run({ data: { roles: [1], permissions: ['students.read'] } }, auth)).toBe(true);
  });

  it('keeps routes without data.permissions working (backward compatible)', () => {
    const auth = { isAuthenticated: () => true, hasRole: () => true, hasPermission: () => false };
    expect(run({ data: { roles: [1] } }, auth)).toBe(true);
  });

  it('refreshes the session before deciding when no valid session exists', () => {
    const auth = {
      isAuthenticated: () => false,
      hasRole: () => true,
      hasPermission: () => true,
      refresh: () => of('token'),
    };
    const result = run({ data: { roles: [1] } }, auth) as { subscribe: (fn: (v: unknown) => void) => void };
    let value: unknown;
    result.subscribe((v) => (value = v));
    expect(value).toBe(true);
  });
});
