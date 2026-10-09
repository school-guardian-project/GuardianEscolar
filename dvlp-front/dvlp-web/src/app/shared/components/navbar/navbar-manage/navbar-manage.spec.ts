import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarManage } from './navbar-manage';
import { provideRouter, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '@core/services/auth.service';
import { of } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';

describe('NavbarManage', () => {
  let component: NavbarManage;
  let fixture: ComponentFixture<NavbarManage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarManage, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { roleId: 1, homeRoute: vi.fn(), logout: () => of(undefined) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarManage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => TestBed.inject(Dialog).closeAll());

  it('opens the administrator menu without superadministrator links and prevents duplicate drawers', () => {
    component.openMenu();
    component.openMenu();
    fixture.detectChanges();
    const dialogs = TestBed.inject(Dialog).openDialogs;
    expect(dialogs).toHaveLength(1);
    const drawer = document.querySelector('app-mobile-navigation')!;
    expect(drawer.querySelectorAll('a')).toHaveLength(8);
    expect(drawer.querySelector('a[href="/admin/guardians"]')).not.toBeNull();
    expect(drawer.querySelector('a[href="/superadmin/schools"]')).toBeNull();
    expect(component.menuOpen).toBe(true);
    dialogs[0].close();
    expect(component.menuOpen).toBe(false);
  });

  it('opens only the superadministrator menu for that role', () => {
    Object.defineProperty(TestBed.inject(AuthService), 'roleId', { value: 5 });
    component.openMenu();
    fixture.detectChanges();
    const drawer = document.querySelector('app-mobile-navigation')!;
    expect(drawer.querySelector('app-sidebar-superadmin')).not.toBeNull();
    expect(drawer.querySelector('app-navbar-admin')).toBeNull();
    expect(drawer.querySelectorAll('a')).toHaveLength(3);
  });

  it('closes using the close button and updates the expanded state', () => {
    component.openMenu();
    fixture.detectChanges();
    (document.querySelector('.navigation-close') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(component.menuOpen).toBe(false);
    expect(fixture.nativeElement.querySelector('.mobile-menu-button').getAttribute('aria-expanded')).toBe('false');
  });

  it('closes using the backdrop', () => {
    component.openMenu();
    (document.querySelector('.cdk-overlay-backdrop') as HTMLElement).click();
    expect(component.menuOpen).toBe(false);
  });

  it('closes when returning to desktop width', () => {
    component.openMenu();
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1440);
    window.dispatchEvent(new Event('resize'));
    expect(component.menuOpen).toBe(false);
    vi.restoreAllMocks();
  });

  it('closes after successful route navigation', async () => {
    component.openMenu();
    await TestBed.inject(Router).navigateByUrl('/');
    expect(component.menuOpen).toBe(false);
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
