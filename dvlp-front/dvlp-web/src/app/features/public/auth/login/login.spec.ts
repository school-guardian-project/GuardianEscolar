import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { throwError } from 'rxjs';

import { Login } from './login';
import { AuthService } from '@core/services/auth.service';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  const authService = { login: vi.fn(), homeRoute: vi.fn(() => '/') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login, TranslateModule.forRoot()],
      providers: [provideRouter([]), provideHttpClient(), { provide: AuthService, useValue: authService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the credentials error below the inputs and clears it when typing', () => {
    authService.login.mockReturnValue(throwError(() => new Error('401')));
    component.form.setValue({ email: 'admin@test.com', password: 'wrong' });

    component.login();
    fixture.detectChanges();

    expect(component.credentialsError).toBe(true);
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#password').classList).toContain('input-error');

    component.form.patchValue({ password: 'other' });
    fixture.detectChanges();

    expect(component.credentialsError).toBe(false);
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });
});