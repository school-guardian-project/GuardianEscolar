import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '@core/services/auth.service';

export const roleGuard: CanMatchFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const allowed = (route.data?.['roles'] as number[] | undefined) ?? [];
  const required = (route.data?.['permissions'] as string[] | undefined) ?? [];

  const decide = () => {
    const roleOk = allowed.length === 0 || auth.hasRole(...allowed);
    const permissionOk = required.length === 0 || auth.hasPermission(...required);
    if (roleOk && permissionOk) {
      return true;
    }
    return router.parseUrl('/home');
  };

  if (auth.isAuthenticated()) {
    return decide();
  }

  if (!isPlatformBrowser(platformId)) {
    return router.parseUrl('/auth/login');
  }

  return auth.refresh().pipe(
    map(decide),
    catchError(() => of(router.parseUrl('/auth/login'))),
  );
};
