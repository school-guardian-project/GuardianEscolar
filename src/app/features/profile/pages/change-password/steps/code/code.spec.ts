import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Code } from './code';
import { provideRouter, Router } from '@angular/router';
import { Email } from '../email/email';

describe('Code', () => {
  let component: Code;
  let fixture: ComponentFixture<Code>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Code],
      providers: [provideRouter([{ path: 'admin/change-password/email', component: Email }])],
    }).compileComponents();

    fixture = TestBed.createComponent(Code);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(TestBed.inject(Router).url).toBe('/admin/change-password/email');
  });
});
