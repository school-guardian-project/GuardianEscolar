import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stops } from './stops';

describe('Stops', () => {
  let component: Stops;
  let fixture: ComponentFixture<Stops>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stops],
    }).compileComponents();

    fixture = TestBed.createComponent(Stops);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
