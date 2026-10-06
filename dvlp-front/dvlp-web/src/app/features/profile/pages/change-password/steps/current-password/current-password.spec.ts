import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentPassword } from './current-password';

describe('CurrentPassword', () => {
  let component: CurrentPassword;
  let fixture: ComponentFixture<CurrentPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentPassword],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrentPassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});