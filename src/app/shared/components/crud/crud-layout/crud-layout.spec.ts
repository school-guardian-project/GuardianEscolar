import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudLayout } from './crud-layout';

describe('CrudLayout', () => {
  let component: CrudLayout;
  let fixture: ComponentFixture<CrudLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(CrudLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
