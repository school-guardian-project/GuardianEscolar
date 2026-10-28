import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let client: HttpClient;
  let http: HttpTestingController;
  let getToken: ReturnType<typeof vi.fn>;
  let refresh: ReturnType<typeof vi.fn>;
  const base = 'https://school-guardian.duckdns.org';

  beforeEach(() => {
    getToken = vi.fn(() => 'access-token');
    refresh = vi.fn(() => of('renewed-token'));
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { getToken, refresh } },
      ],
    });
    client = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it.each(['forgot', 'forgot/verify', 'reset', 'forgot?source=profile'])(
    'does not add credentials or refresh for public password %s',
    path => {
      const error = vi.fn();
      const url = `${base}/api/v1/password/${path}`;
      client.post(url, {}).subscribe({ error });
      const request = http.expectOne(url);
      expect(request.request.headers.has('Authorization')).toBe(false);
      expect(request.request.withCredentials).toBe(false);
      request.flush({}, { status: 401, statusText: 'Unauthorized' });
      expect(error).toHaveBeenCalledOnce();
      expect(refresh).not.toHaveBeenCalled();
      expect(getToken).not.toHaveBeenCalled();
    },
  );

  it.each(['login', 'refresh'])('keeps %s credentialed without retrying its 401', path => {
    const error = vi.fn();
    const url = `${base}/api/v1/auth/${path}`;
    client.post(url, {}).subscribe({ error });
    const request = http.expectOne(url);
    expect(request.request.withCredentials).toBe(true);
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(error).toHaveBeenCalledOnce();
    expect(refresh).not.toHaveBeenCalled();
  });

  it.each([
    '/api/v1/email/change/request',
    '/api/v1/phone/change/request',
    '/notification/api/v1/notifications/alerts',
    '/notification/api/v1/notifications/alert-types',
    '/api/v1/password/reset/other',
  ])('preserves authenticated retry for %s', path => {
    const error = vi.fn();
    const url = `${base}${path}`;
    client.post(url, {}).subscribe({ error });
    const initial = http.expectOne(url);
    expect(initial.request.headers.get('Authorization')).toBe('Bearer access-token');
    expect(initial.request.withCredentials).toBe(true);
    initial.flush({}, { status: 401, statusText: 'Unauthorized' });
    const retry = http.expectOne(url);
    expect(retry.request.headers.get('Authorization')).toBe('Bearer renewed-token');
    expect(refresh).toHaveBeenCalledOnce();
    retry.flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(error).toHaveBeenCalledOnce();
    expect(refresh).toHaveBeenCalledOnce();
  });

  it.each([0, 400, 403, 404, 500])('does not refresh on status %s', status => {
    const url = `${base}/notification/api/v1/notifications/alerts`;
    client.get(url).subscribe({ error: () => {} });
    const request = http.expectOne(url);
    if (status === 0) {
      request.error(new ProgressEvent('error'));
    } else {
      request.flush({}, { status, statusText: 'Failure' });
    }
    expect(refresh).not.toHaveBeenCalled();
  });

  it('propagates a failed refresh without retrying the business request', () => {
    const failure = new HttpErrorResponse({ status: 401 });
    refresh.mockReturnValueOnce(throwError(() => failure));
    const error = vi.fn();
    const url = `${base}/api/v1/email/change/request`;
    client.post(url, {}).subscribe({ error });
    http.expectOne(url).flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(error).toHaveBeenCalledWith(failure);
    expect(refresh).toHaveBeenCalledOnce();
    http.expectNone(url);
  });
});
