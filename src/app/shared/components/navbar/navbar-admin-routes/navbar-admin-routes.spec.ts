import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarAdminRoutes } from './navbar-admin-routes';

describe('NavbarAdminRoutes', () => {
  let component: NavbarAdminRoutes;
  let fixture: ComponentFixture<NavbarAdminRoutes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarAdminRoutes],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarAdminRoutes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
