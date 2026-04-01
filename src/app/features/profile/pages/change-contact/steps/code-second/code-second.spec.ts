import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeSecond } from './code-second';

describe('CodeSecond', () => {
  let component: CodeSecond;
  let fixture: ComponentFixture<CodeSecond>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeSecond],
    }).compileComponents();

    fixture = TestBed.createComponent(CodeSecond);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
