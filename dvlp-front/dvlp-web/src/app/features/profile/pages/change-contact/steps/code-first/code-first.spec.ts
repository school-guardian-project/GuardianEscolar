import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeFirst } from './code-first';

describe('CodeFirst', () => {
  let component: CodeFirst;
  let fixture: ComponentFixture<CodeFirst>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeFirst],
    }).compileComponents();

    fixture = TestBed.createComponent(CodeFirst);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
