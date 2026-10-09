import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarManage } from './navbar-manage';
import { provideRouter, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '@core/services/auth.service';
import { of } from 'rxjs';

describe('NavbarManage', () => {
  let component: NavbarManage;
  let fixture: ComponentFixture<NavbarManage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarManage, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { homeRoute: vi.fn(), logout: () => of(undefined) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarManage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  for (const route of ['/dashboard-admin', '/dashboard-superadmin']) {
    it(`the navbar arrow always navigates to ${route}`, () => {
      vi.spyOn(TestBed.inject(AuthService), 'homeRoute').mockReturnValue(route);
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
      component.backRoute = '/admin/families';
      fixture.detectChanges();
      fixture.nativeElement.querySelector('.toolbar-start button').click();
      expect(navigate).toHaveBeenCalledWith(route);
    });
  }
});
