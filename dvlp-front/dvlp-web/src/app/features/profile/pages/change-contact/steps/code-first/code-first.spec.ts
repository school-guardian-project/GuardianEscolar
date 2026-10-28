import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeFirst } from './code-first';
import { provideRouter, Router } from '@angular/router';
import { Telephone } from '../telephone/telephone';

describe('CodeFirst', () => {
  let component: CodeFirst;
  let fixture: ComponentFixture<CodeFirst>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeFirst],
      providers: [provideRouter([{ path: 'admin/change-contact/telephone', component: Telephone }])],
    }).compileComponents();

    fixture = TestBed.createComponent(CodeFirst);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(TestBed.inject(Router).url).toBe('/admin/change-contact/telephone');
  });
});
