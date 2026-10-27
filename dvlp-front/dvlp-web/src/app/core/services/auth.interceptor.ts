import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

function withBearer(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({ 
    setHeaders: { Authorization: `Bearer ${token}` },
    withCredentials: true  // Ensure cookies are sent cross-origin
  });
}

function withCredentials(req: HttpRequest<unknown>): HttpRequest<unknown> {
  return req.clone({ withCredentials: true });
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const isPublicPasswordRecovery = /\/api\/v1\/password\/(?:forgot(?:\/verify)?|reset)(?:[?#]|$)/.test(req.url);
  if (isPublicPasswordRecovery) {
    return next(req);
  }

  // Endpoints públicos que NO requieren token
  const publicEndpoints = ['/api/v1/auth/login', '/api/v1/auth/refresh'];
  if (publicEndpoints.some(ep => req.url.includes(ep))) {
    return next(withCredentials(req));
  }

  let retried = false;
  const send = (token: string | null) => next(token ? withBearer(req, token) : withCredentials(req));

  return send(auth.getToken()).pipe(
    catchError((error: unknown) => {
      const expired = error instanceof HttpErrorResponse && error.status === 401;
      if (!expired || retried) {
        return throwError(() => error);
      }
      retried = true;
      return auth.refresh().pipe(switchMap((token) => send(token)));
    }),
  );
};
