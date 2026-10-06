import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { Code } from './code';

describe('Code', () => {
  let component: Code;
  let fixture: ComponentFixture<Code>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Code],
      providers: [
        provideHttpClient(),
        provideTranslateService(),
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Code);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('requires exactly six numeric digits', () => {
    expect(component.form.invalid).toBe(true);

    component.form.setValue({ pin: ['1', '2', '3', '4', '5', '6'] });
    expect(component.form.valid).toBe(true);

    component.pinControls.at(5).setValue('A');
    expect(component.form.invalid).toBe(true);
  });
});
