import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { vi } from 'vitest';

import { SidebarAdmin } from './sidebar-admin';
import { AuthService, PERMISSIONS } from '@core/services/auth.service';

describe('SidebarAdmin', () => {
  let component: SidebarAdmin;
  let fixture: ComponentFixture<SidebarAdmin>;

  /** Sesión que solo puede leer estudiantes: el menú de buses debe quedar oculto. */
  const authStub = {
    hasPermission: vi.fn((...permissions: string[]) => permissions.includes(PERMISSIONS.STUDENTS_READ)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarAdmin, TranslateModule.forRoot()],
      providers: [provideRouter([]), { provide: AuthService, useValue: authStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarAdmin);
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
    expect(drawer.querySelector('a[href="/admin/buses"]')).toBeNull();
  });
});
