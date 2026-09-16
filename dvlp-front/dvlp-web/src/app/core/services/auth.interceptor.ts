import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // [MOCK-API] No añadir Authorization a json-server :3000 (evita preflight CORS en DELETE/PUT/POST)
    if (req.url.includes(':3000')) {
        return next(req);
    }
    const token = inject(AuthService).getToken();

    if (token) {
        const cloned = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        return next(cloned);
    }

    return next(req);
}