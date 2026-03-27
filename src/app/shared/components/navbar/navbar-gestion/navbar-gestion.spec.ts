import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarGestion } from './navbar-gestion';

describe('NavbarGestion', () => {
  let component: NavbarGestion;
  let fixture: ComponentFixture<NavbarGestion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarGestion],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarGestion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
