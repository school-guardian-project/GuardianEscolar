import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { Reset } from './reset';

describe('Reset', () => {
  let component: Reset;
  let fixture: ComponentFixture<Reset>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reset],
      providers: [
        provideHttpClient(),
        provideTranslateService(),
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => ({ subscribe: () => undefined }) }) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Reset);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('enforces the password policy and matching confirmation', () => {
    component.form.setValue({ password: 'weak', confirmPassword: 'weak' });
    expect(component.form.invalid).toBe(true);

    component.form.setValue({ password: 'StrongPass1!', confirmPassword: 'OtherPass2!' });
    expect(component.form.hasError('passwordNoMatch')).toBe(true);

    component.form.setValue({ password: 'StrongPass1!', confirmPassword: 'StrongPass1!' });
    expect(component.form.valid).toBe(true);

    component.form.setValue({
      password: 'A'.repeat(126) + 'a1!',
      confirmPassword: 'A'.repeat(126) + 'a1!',
    });
    expect(component.form.get('password')?.hasError('maxlength')).toBe(true);
  });
});
