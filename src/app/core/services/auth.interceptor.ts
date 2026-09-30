import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

function withBearer(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  if (req.url.includes('/api/v1/auth/')) {
    const token = auth.getToken();
    return next(token ? withBearer(req, token) : req);
  }

  let retried = false;
  const send = (token: string | null) => next(token ? withBearer(req, token) : req);

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
