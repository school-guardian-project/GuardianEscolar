import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavComponent } from './nav-component';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { Dialog } from '@angular/cdk/dialog';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { roleId: 1, hasRole: () => true } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => TestBed.inject(Dialog).closeAll());

  it('does not show a role menu on login or public recovery forms', () => {
    expect(component.canOpenMenu).toBe(false);
    component.openMenu();
    expect(TestBed.inject(Dialog).openDialogs).toHaveLength(0);
  });

  it('allows the same role menu on themed profile-change forms', async () => {
    fixture.componentRef.setInput('themed', true);
    fixture.detectChanges();
    component.openMenu();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.menuOpen).toBe(true);
    expect(document.querySelector('app-mobile-navigation app-navbar-admin')).not.toBeNull();
    TestBed.inject(Dialog).closeAll();
    expect(component.menuOpen).toBe(false);
  });
});
