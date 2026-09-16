// [MOCK-API] Servicio genérico contra json-server — seguro, cacheado, DRY
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, of, tap, catchError, timeout } from 'rxjs';
import { MOCK_API_CONFIG } from './mock-api.config';
import { MockApiError } from './mock-api.errors';
import { sanitizeQuery } from './mock-api.validators';
import { getCache, setCache } from './mock-api.cache';

@Injectable({ providedIn: 'root' })
export class MockApiService {
  private http = inject(HttpClient);

  private url(path: string): string {
    if (!path.startsWith('/')) throw new MockApiError('Ruta inválida', 400, null);
    return `${MOCK_API_CONFIG.baseUrl}${path}`;
  }

  private mask(url: string): string {
    return url.replace(/Email=[^&]+/i, 'Email=***');
  }

  get<T>(path: string, params?: Record<string, string | number | boolean>): Observable<T> {
    const safe = sanitizeQuery(path, params as any);
    let httpParams = new HttpParams();
    Object.entries(safe).forEach(([k, v]) => (httpParams = httpParams.set(k, String(v))));
    const url = this.url(path);
    const cacheKey = `GET:${url}?${httpParams.toString()}`;
    const hit = getCache(cacheKey);
    if (hit) return of(hit as T);

    if ((globalThis as any).__DEV__ ?? true) console.log(`[MOCK-API] GET ${this.mask(url)}`, safe);
    return this.http.get<T>(url, { params: httpParams, headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' } }).pipe(
      timeout(MOCK_API_CONFIG.timeoutMs),
      tap((res) => {
        setCache(cacheKey, res);
        if ((globalThis as any).__DEV__ ?? true) console.log(`[MOCK-API] <-`, Array.isArray(res) ? `array[${(res as any).length}]` : typeof res);
      }),
      catchError((err) => {
        const status = err?.status ?? null;
        if (err?.name === 'TimeoutError') return throwError(() => MockApiError.timeout());
        if (status) return throwError(() => MockApiError.fromStatus(status, err.error));
        return throwError(() => MockApiError.network());
      })
    );
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(this.url(path), body).pipe(
      timeout(MOCK_API_CONFIG.timeoutMs),
      catchError((err) => throwError(() => MockApiError.fromStatus(err.status ?? 500, err.error)))
    );
  }
  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(this.url(path), body).pipe(timeout(MOCK_API_CONFIG.timeoutMs));
  }
  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(this.url(path)).pipe(timeout(MOCK_API_CONFIG.timeoutMs));
  }

  list<T>(resource: string, params: Record<string, any> = {}): Observable<T[]> {
    const p = { _limit: 50, ...params };
    if (p._limit > 100) p._limit = 100;
    return this.get<T[]>(resource, p);
  }
  getById<T>(resource: string, id: string | number): Observable<T | null> {
    const key = resource === '/roles' ? 'ID' : 'Id';
    return this.get<T[]>(resource, { [key]: String(id) } as any).pipe(
      // mapea array[1] -> objeto (json-server no soporta :id con campo Id)
      tap(() => {}),
    ) as unknown as Observable<T | null>;
  }
}
