import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuLandingPage } from './menu-landing-page';

describe('MenuLandingPage', () => {
  let component: MenuLandingPage;
  let fixture: ComponentFixture<MenuLandingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuLandingPage],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuLandingPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
