import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { Email } from './email';

describe('Email', () => {
  let component: Email;
  let fixture: ComponentFixture<Email>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Email],
      providers: [
        provideHttpClient(),
        provideTranslateService(),
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Email);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('validates required, malformed and overlong email addresses', () => {
    const email = component.form.get('email');
    expect(email?.valid).toBe(false);

    email?.setValue('not-an-email');
    expect(email?.hasError('email')).toBe(true);

    email?.setValue(`${'a'.repeat(90)}@school.com`);
    expect(email?.hasError('maxlength')).toBe(true);

    email?.setValue('admin@school.com');
    expect(email?.valid).toBe(true);
  });
});
