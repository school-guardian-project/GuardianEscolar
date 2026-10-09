import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Navbar } from './navbar';
import { provideRouter, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '@core/services/auth.service';
import { Dialog } from '@angular/cdk/dialog';
import { of } from 'rxjs';

describe('navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: {
          isAuthenticated: () => false, refresh: () => of(null), hasRole: () => false,
        } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => TestBed.inject(Dialog).closeAll());

  it('the mobile contact action closes the drawer and navigates', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    component.openMenu();
    fixture.detectChanges();
    const buttons = document.querySelectorAll('.public-navigation button');
    (buttons[buttons.length - 1] as HTMLButtonElement).click();
    expect(component.menuOpen).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['contact']);
  });

  it('opens home with a fragment when the requested section is on another page', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    component.scrollToSection('funcionalidades');
    expect(navigate).toHaveBeenCalledWith(['/home'], { fragment: 'funcionalidades' });
  });

  it('public navigation does not show management options to an anonymous visitor', () => {
    component.openMenu();
    fixture.detectChanges();
    const drawer = document.querySelector('app-mobile-navigation')!;
    expect(drawer.querySelector('app-navbar-admin')).toBeNull();
    expect(drawer.querySelector('app-sidebar-superadmin')).toBeNull();
    expect(drawer.querySelectorAll('.public-navigation button')).toHaveLength(4);
  });
});
