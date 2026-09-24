import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Guardians } from './guardians';

describe('Guardians', () => {
  let component: Guardians;
  let fixture: ComponentFixture<Guardians>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Guardians],
    }).compileComponents();

    fixture = TestBed.createComponent(Guardians);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
