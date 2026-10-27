import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideRouter, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subject, throwError } from 'rxjs';
import { SchoolsService } from '@core/services/schools.service';
import { AdminsService } from '../../superadmin/admins/services/admins.service';

import { DashboardSuperadmin } from './dashboard-superadmin';

describe('DashboardSuperadmin', () => {
  let component: DashboardSuperadmin;
  let fixture: ComponentFixture<DashboardSuperadmin>;
  let listSchools: ReturnType<typeof vi.fn>;
  let listAdmins: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    listSchools = vi.fn(() => of([{ id: 'school-1' }, { id: 'school-2' }]));
    listAdmins = vi.fn(() => of([{ id: 'admin-1' }, { id: 'admin-2' }, { id: 'admin-3' }]));
    await TestBed.configureTestingModule({
      imports: [DashboardSuperadmin, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: SchoolsService, useValue: { list: listSchools } },
        { provide: AdminsService, useValue: { list: listAdmins } },
      ],
    }).overrideComponent(DashboardSuperadmin, {
      set: {
        imports: [CommonModule, RouterModule, TranslateModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      },
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardSuperadmin);
    component = fixture.componentInstance;
    vi.spyOn(component, 'isChildRouteActive').mockReturnValue(false);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders only the real administrator and school totals', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(listSchools).toHaveBeenCalledTimes(1);
    expect(listAdmins).toHaveBeenCalledTimes(1);
    expect(element.querySelectorAll('.metric-card')).toHaveLength(2);
    expect(Array.from(element.querySelectorAll('.metric-value'), node => node.textContent?.trim()))
      .toEqual(['3', '2']);
    expect(element.querySelector('.alerts-section')).toBeNull();
    expect(element.querySelector('app-comments')).toBeNull();
    expect(element.querySelector('button')).toBeNull();
  });

  it('renders real zeros when no schools or administrators are registered', () => {
    listSchools.mockReturnValueOnce(of([]));
    listAdmins.mockReturnValueOnce(of([]));
    component.loadSchools();
    component.loadAdmins();
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(Array.from(element.querySelectorAll('.metric-value'), node => node.textContent?.trim()))
      .toEqual(['0', '0']);
  });

  it.each(['admins', 'schools'])('shows a %s error without hiding the other count and retries', metric => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    const request = metric === 'admins' ? listAdmins : listSchools;
    request.mockReturnValueOnce(throwError(() => new Error('Unavailable')));
    if (metric === 'admins') component.loadAdmins();
    else component.loadSchools();
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(component.adminsTotal).toBe(metric === 'admins' ? null : 3);
    expect(component.schoolsTotal).toBe(metric === 'schools' ? null : 2);
    expect(element.querySelector('[role="alert"]')).not.toBeNull();
    expect(Array.from(element.querySelectorAll('.metric-value'), node => node.textContent?.trim()))
      .toEqual(metric === 'admins' ? ['—', '2'] : ['3', '—']);
    element.querySelector<HTMLButtonElement>('.metric-error button')?.click();
    fixture.detectChanges();
    expect(element.querySelector('[role="alert"]')).toBeNull();
    expect(component.adminsTotal).toBe(3);
    expect(component.schoolsTotal).toBe(2);
    log.mockRestore();
  });

  it('shows loading states and prevents duplicate requests', () => {
    const schools = new Subject<[]>();
    const admins = new Subject<[]>();
    listSchools.mockReturnValueOnce(schools);
    listAdmins.mockReturnValueOnce(admins);
    component.loadSchools();
    component.loadAdmins();
    component.loadSchools();
    component.loadAdmins();
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(listSchools).toHaveBeenCalledTimes(2);
    expect(listAdmins).toHaveBeenCalledTimes(2);
    expect(element.querySelectorAll('[aria-busy="true"]')).toHaveLength(2);
    expect(element.querySelectorAll('[role="status"]')).toHaveLength(2);
    schools.next([]);
    schools.complete();
    admins.next([]);
    admins.complete();
    expect(component.loadingSchools || component.loadingAdmins).toBe(false);
  });

  it('cancels outstanding requests when leaving the dashboard', () => {
    const schools = new Subject<[]>();
    const admins = new Subject<[]>();
    listSchools.mockReturnValueOnce(schools);
    listAdmins.mockReturnValueOnce(admins);
    component.loadSchools();
    component.loadAdmins();
    fixture.destroy();
    expect(schools.observed || admins.observed).toBe(false);
    expect(component.loadingSchools || component.loadingAdmins).toBe(false);
  });

  it('preserves child management routes without displaying dashboard cards', () => {
    vi.mocked(component.isChildRouteActive).mockReturnValue(true);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('.metrics')).toBeNull();
    expect(element.querySelector('router-outlet')).not.toBeNull();
  });
});
