import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reset } from './reset';
import { provideRouter, Router } from '@angular/router';
import { Telephone } from '../telephone/telephone';

describe('Reset', () => {
  let component: Reset;
  let fixture: ComponentFixture<Reset>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reset],
      providers: [provideRouter([{ path: 'admin/change-contact/telephone', component: Telephone }])],
    }).compileComponents();

    fixture = TestBed.createComponent(Reset);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(TestBed.inject(Router).url).toBe('/admin/change-contact/telephone');
  });
});
