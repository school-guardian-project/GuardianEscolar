import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeSecond } from './code-second';
import { provideRouter, Router } from '@angular/router';
import { Telephone } from '../telephone/telephone';

describe('CodeSecond', () => {
  let component: CodeSecond;
  let fixture: ComponentFixture<CodeSecond>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeSecond],
      providers: [provideRouter([{ path: 'admin/change-contact/telephone', component: Telephone }])],
    }).compileComponents();

    fixture = TestBed.createComponent(CodeSecond);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(TestBed.inject(Router).url).toBe('/admin/change-contact/telephone');
  });
});
