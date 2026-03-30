import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarManage } from './navbar-manage';

describe('NavbarManage', () => {
  let component: NavbarManage;
  let fixture: ComponentFixture<NavbarManage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarManage],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarManage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
