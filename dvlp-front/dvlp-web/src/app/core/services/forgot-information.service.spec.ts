import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ForgotInformationService } from './forgot-information.service';

describe('ForgotInformationService', () => {
  let service: ForgotInformationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ForgotInformationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('requests a recovery code and keeps the email only after acceptance', () => {
    service.requestPasswordReset('person@school.com').subscribe();

    const request = httpMock.expectOne((req) => req.url.endsWith('/api/v1/password/forgot'));
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ email: 'person@school.com' });
    expect(service.hasRequestedReset).toBe(false);

    request.flush({ message: 'If the email exists, a code will be sent.' });

    expect(service.hasRequestedReset).toBe(true);
    expect(service.hasVerifiedResetCode).toBe(false);
  });

  it('verifies the code and sends the returned reset token with the new password', () => {
    service.requestPasswordReset('person@school.com').subscribe();
    httpMock.expectOne((req) => req.url.endsWith('/forgot')).flush({});

    service.verifyPasswordResetCode('123456').subscribe();
    const verification = httpMock.expectOne((req) => req.url.endsWith('/forgot/verify'));
    expect(verification.request.body).toEqual({ email: 'person@school.com', code: '123456' });
    verification.flush({ resetToken: 'single-use-token' });

    expect(service.hasVerifiedResetCode).toBe(true);

    service.resetPassword('StrongPass1!', 'StrongPass1!').subscribe();
    const reset = httpMock.expectOne((req) => req.url.endsWith('/reset'));
    expect(reset.request.body).toEqual({
      email: 'person@school.com',
      resetToken: 'single-use-token',
      newPassword: 'StrongPass1!',
      confirmPassword: 'StrongPass1!',
    });
    reset.flush({ message: 'Password updated.' });

    expect(service.hasRequestedReset).toBe(false);
    expect(service.hasVerifiedResetCode).toBe(false);
  });

  it('does not allow code verification before requesting a code', () => {
    expect(() => service.verifyPasswordResetCode('123456')).toThrowError(
      'A password reset must be requested before verifying a code.',
    );
  });

  it('does not allow password reset before verifying a code', () => {
    expect(() => service.resetPassword('StrongPass1!', 'StrongPass1!')).toThrowError(
      'A verified password reset code is required before resetting the password.',
    );
  });
});
