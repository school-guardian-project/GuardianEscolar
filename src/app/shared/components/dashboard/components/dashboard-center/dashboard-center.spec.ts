import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCenter } from './dashboard-center';

describe('DashboardCenter', () => {
  let component: DashboardCenter;
  let fixture: ComponentFixture<DashboardCenter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCenter],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardCenter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
