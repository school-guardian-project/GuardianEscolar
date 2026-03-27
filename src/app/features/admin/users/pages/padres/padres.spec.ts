import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Padres } from './padres';

describe('Padres', () => {
  let component: Padres;
  let fixture: ComponentFixture<Padres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Padres],
    }).compileComponents();

    fixture = TestBed.createComponent(Padres);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
