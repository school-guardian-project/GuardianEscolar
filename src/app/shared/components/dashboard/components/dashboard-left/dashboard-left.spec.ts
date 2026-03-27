import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLeft } from './dashboard-left';

describe('DashboardLeft', () => {
  let component: DashboardLeft;
  let fixture: ComponentFixture<DashboardLeft>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardLeft],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardLeft);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
