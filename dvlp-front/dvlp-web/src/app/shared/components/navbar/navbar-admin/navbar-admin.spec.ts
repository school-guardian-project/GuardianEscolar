import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { vi } from 'vitest';

import { NavbarAdmin } from './navbar-admin';
import { AuthService, PERMISSIONS } from '@core/services/auth.service';

describe('NavbarAdmin', () => {
  let component: NavbarAdmin;
  let fixture: ComponentFixture<NavbarAdmin>;

  /** Sesión que solo puede leer estudiantes: los demás menús deben quedar ocultos. */
  const authStub = {
    hasPermission: vi.fn((...permissions: string[]) => permissions.includes(PERMISSIONS.STUDENTS_READ)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarAdmin, TranslateModule.forRoot()],
      providers: [provideRouter([]), { provide: AuthService, useValue: authStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('hides the entries whose read permission the session does not have', () => {
    const drawer = fixture.nativeElement as HTMLElement;
    expect(drawer.querySelector('a[href="/admin/users"]')).not.toBeNull();
    expect(drawer.querySelector('a[href="/admin/families"]')).not.toBeNull();
    expect(drawer.querySelector('a[href="/admin/drivers"]')).toBeNull();
    expect(drawer.querySelector('a[href="/admin/buses"]')).toBeNull();
    expect(drawer.querySelector('a[href="/admin/routes"]')).toBeNull();
    expect(drawer.querySelector('a[href="/admin/stops"]')).toBeNull();
  });
});
