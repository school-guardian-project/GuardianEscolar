import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRight } from './dashboard-right';

describe('DashboardRight', () => {
  let component: DashboardRight;
  let fixture: ComponentFixture<DashboardRight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRight],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardRight);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
