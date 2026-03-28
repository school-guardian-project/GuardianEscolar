import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paradas } from './paradas';

describe('Paradas', () => {
  let component: Paradas;
  let fixture: ComponentFixture<Paradas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Paradas],
    }).compileComponents();

    fixture = TestBed.createComponent(Paradas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
