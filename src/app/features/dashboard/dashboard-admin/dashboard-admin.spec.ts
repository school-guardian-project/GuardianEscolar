import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, Subject, throwError } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { SchoolsService } from '@core/services/schools.service';
import { ProfileService } from '@core/services/profile.service';
import { SchoolResponseDto } from '@core/models/school.model';
import { RecordInformation } from '@shared/components/modal/record-information/record-information';
import { Alert, AlertsResponse, AlertsService } from '@core/services/alerts.service';

import { DashboardAdmin } from './dashboard-admin';

describe('DashboardAdmin', () => {
  let component: DashboardAdmin;
  let fixture: ComponentFixture<DashboardAdmin>;
  let getSchool: ReturnType<typeof vi.fn>;
  let getProfile: ReturnType<typeof vi.fn>;
  let session: { schoolId: string | null };
  let updateSessionSchoolId: ReturnType<typeof vi.fn>;
  let getAlerts: ReturnType<typeof vi.fn>;
  let getAlertTypes: ReturnType<typeof vi.fn>;
  const alert: Alert = {
    id: 'alert-1', profileId: 'student-1', routeExecutionId: 'trip-1',
    studentName: 'Ana', routeName: 'Ruta 1', alertType: 1,
    alertTypeId: 1, alertTypeName: 'Bus Delay', message: 'Demora en la ruta',
    timestamp: '2026-10-26T12:00:00Z', acknowledged: false,
  };
  const response: AlertsResponse = {
    content: [alert], totalElements: 21, totalPages: 3, size: 10, number: 0,
  };
  const school: SchoolResponseDto = {
    id: 'school-1', cityId: 'city-1', cityName: 'Neiva',
    name: 'Colegio Central', address: 'Calle 10 # 5-20', logo: '',
    phone: 3001234567, email: 'central@example.com',
    website: 'https://central.example.com', theme: 'Primaria', status: 'Active',
  };

  beforeEach(async () => {
    session = { schoolId: 'school-1' };
    getSchool = vi.fn(() => of(school));
    getProfile = vi.fn(() => of({
      profileId: 'profile-1', personId: 'person-1', email: 'admin@example.com',
      roleId: 1, roleName: 'Administrator', campusId: null, schoolId: 'school-1',
    }));
    updateSessionSchoolId = vi.fn((schoolId: string | null) => { session.schoolId = schoolId; });
    getAlerts = vi.fn(() => of(response));
    getAlertTypes = vi.fn(() => of([{ id: 1, name: 'Bus Delay' }, { id: 25, name: 'On Board' }]));
    await TestBed.configureTestingModule({
      imports: [DashboardAdmin, RecordInformation, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { session, updateSessionSchoolId } },
        { provide: SchoolsService, useValue: { get: getSchool } },
        { provide: ProfileService, useValue: { getProfile } },
        { provide: AlertsService, useValue: { getAlerts, getAlertTypes } },
      ],
    }).overrideComponent(DashboardAdmin, { set: { template: '' } }).compileComponents();

    fixture = TestBed.createComponent(DashboardAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates catalog labels when switching among the four supported languages', () => {
    const translate = TestBed.inject(TranslateService);
    const labels = {
      es: ['Retraso del bus', 'Abordaje'],
      en: ['Bus delay', 'Boarding'],
      fr: ['Retard du bus', 'Montée'],
      pt: ['Atraso do ônibus', 'Embarque'],
    };
    for (const [language, [delay, boarding]] of Object.entries(labels)) {
      translate.setTranslation(language, {
        dashboard: { alerts: { types: { 'Bus Delay': delay, 'On Board': boarding } } },
      });
      translate.use(language);
      expect(component.alertTypeLabel('Bus Delay')).toBe(delay);
      expect(component.alertTypeLabel('On Board')).toBe(boarding);
    }
    expect(component.alertTypes[0].name).toBe('Bus Delay');
    expect(component.alerts[0].message).toBe('Demora en la ruta');
  });

  it('keeps new catalog names visible and translates missing-type labels', () => {
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('es', { dashboard: { alerts: { unknownType: 'Sin tipo' } } });
    translate.use('es');
    expect(component.alertTypeLabel('New catalog type')).toBe('New catalog type');
    expect(component.alertTypeLabel('')).toBe('Sin tipo');
  });

  it('loads persisted school alerts and the database type catalog on initialization', () => {
    expect(getAlerts).toHaveBeenCalledWith({
      schoolId: 'school-1', page: 0, size: 10, search: '', alertTypeId: undefined,
    });
    expect(component.alerts).toEqual([alert]);
    expect(component.alertTypes[0].name).toBe('Bus Delay');
    expect(component.alertsTotal).toBe(21);
  });

  it('combines search and catalog type filters and resets pagination', () => {
    component.alertsPage = 2;
    component.alertSearch = '  demora  ';
    component.selectedAlertType = 1;
    component.filterAlerts();

    expect(getAlerts).toHaveBeenLastCalledWith({
      schoolId: 'school-1', page: 0, size: 10, search: 'demora', alertTypeId: 1,
    });
    component.changeAlertsPage(1);
    expect(getAlerts).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1 }));
    component.changeAlertsPage(3);
    expect(component.alertsPage).toBe(1);
  });

  it('resolves the school from the profile instead of a stale session', () => {
    session.schoolId = 'another-school';
    component.loadAlerts();
    expect(getAlerts).toHaveBeenLastCalledWith(expect.objectContaining({ schoolId: 'school-1' }));
  });

  it('never queries global alerts when the profile has no school', () => {
    getAlerts.mockClear();
    getProfile.mockReturnValueOnce(of({ schoolId: null }));
    component.loadAlerts();
    expect(getAlerts).not.toHaveBeenCalled();
    expect(component.alertsErrorKey).toBe('dashboard.alerts.noSchool');
    expect(component.alerts).toEqual([]);
  });

  it('reports an alert failure and recovers on retry', () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    getAlerts.mockReturnValueOnce(throwError(() => new Error('Unavailable')));
    component.loadAlerts();
    expect(component.alertsErrorKey).toBe('dashboard.alerts.loadError');
    expect(component.loadingAlerts).toBe(false);
    expect(component.alerts).toEqual([]);
    component.loadAlerts();
    expect(component.alertsErrorKey).toBe('');
    expect(component.alerts).toEqual([alert]);
    log.mockRestore();
  });

  it('debounces text searches and returns to the first page', async () => {
    vi.useFakeTimers();
    try {
      getAlerts.mockClear();
      component.alertsPage = 2;
      component.alertSearch = 'demora';
      component.searchAlerts();
      component.searchAlerts();
      await vi.advanceTimersByTimeAsync(299);
      expect(getAlerts).not.toHaveBeenCalled();
      await vi.advanceTimersByTimeAsync(1);
      expect(getAlerts).toHaveBeenCalledTimes(1);
      expect(getAlerts).toHaveBeenCalledWith(expect.objectContaining({ page: 0, search: 'demora' }));
    } finally {
      vi.useRealTimers();
    }
  });

  it('reports catalog failures independently and allows retrying', () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    getAlertTypes.mockReturnValueOnce(throwError(() => new Error('Unavailable')));
    component.loadAlertTypes();
    expect(component.alertTypesError).toBe(true);
    expect(component.alerts).toEqual([alert]);
    component.loadAlertTypes();
    expect(component.alertTypesError).toBe(false);
    expect(component.alertTypes).toHaveLength(2);
    log.mockRestore();
  });

  it('does not request alerts if resolving the current profile fails', () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    getAlerts.mockClear();
    getProfile.mockReturnValueOnce(throwError(() => new Error('Unavailable')));
    component.loadAlerts();
    expect(getAlerts).not.toHaveBeenCalled();
    expect(component.alertsErrorKey).toBe('dashboard.alerts.loadError');
    log.mockRestore();
  });

  it('cancels stale requests and cleans up on destroy', () => {
    const pending = new Subject<AlertsResponse>();
    getAlerts.mockReturnValueOnce(pending);
    component.loadAlerts();
    expect(component.loadingAlerts).toBe(true);
    component.selectedAlertType = 25;
    component.filterAlerts();
    pending.next({ ...response, content: [] });
    expect(component.alerts).toEqual([alert]);
    expect(component.loadingAlerts).toBe(false);
    const calls = getAlerts.mock.calls.length;
    fixture.destroy();
    component.loadAlerts();
    expect(getAlerts).toHaveBeenCalledTimes(calls);
  });

  it('loads the school associated with the session when opening information', () => {
    component.showDetails();

    expect(getSchool).toHaveBeenCalledWith('school-1');
    expect(component.showInformation).toBe(true);
    expect(component.schoolSelected).toEqual({
      ...school, city: 'Neiva', schooling: 'Primaria',
    });
    const modal = TestBed.createComponent(RecordInformation).componentInstance;
    modal.type = 'schools';
    modal.record = component.schoolSelected;
    expect(modal.displayName).toBe('Colegio Central');
    expect(modal.getVisibleFields()).toEqual(expect.arrayContaining([
      { key: 'city', value: 'Neiva' },
      { key: 'phone', value: 3001234567 },
      { key: 'email', value: 'central@example.com' },
    ]));
  });

  it('does not open an empty modal when no school is associated', () => {
    getProfile.mockReturnValueOnce(of({
      profileId: 'profile-1', personId: 'person-1', email: 'admin@example.com',
      roleId: 1, roleName: 'Administrator', campusId: null, schoolId: null,
    }));
    component.showDetails();

    expect(getSchool).not.toHaveBeenCalled();
    expect(component.showInformation).toBe(false);
    expect(component.schoolErrorKey).toBe('dashboard.schoolInformation.noSchool');
  });

  it('loads the assigned school from the profile before opening the update modal', () => {
    session.schoolId = 'stale-school-id';
    component.openSchoolUpdate();

    expect(getProfile).toHaveBeenCalled();
    expect(updateSessionSchoolId).toHaveBeenCalledWith('school-1');
    expect(session.schoolId).toBe('school-1');
    expect(component.schoolIdForUpdate).toBe('school-1');
    expect(component.showUpdateInformation).toBe(true);
  });

  it('shows a loading failure and allows a retry', () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    getSchool.mockReturnValueOnce(throwError(() => new Error('Unavailable')));
    component.showDetails();

    expect(component.showInformation).toBe(false);
    expect(component.loadingSchool).toBe(false);
    expect(component.schoolErrorKey).toBe('dashboard.schoolInformation.loadError');
    component.showDetails();
    expect(component.showInformation).toBe(true);
    expect(component.schoolErrorKey).toBe('');
    log.mockRestore();
  });

  it('waits for the response and prevents duplicate requests', () => {
    const response = new Subject<SchoolResponseDto>();
    getSchool.mockReturnValue(response);
    component.showDetails();
    component.showDetails();
    expect(getSchool).toHaveBeenCalledTimes(1);
    expect(component.showInformation).toBe(false);
    expect(component.loadingSchool).toBe(true);
    response.next(school);
    response.complete();
    expect(component.showInformation).toBe(true);
    component.closeModal();
    expect(component.schoolSelected).toEqual({});
    expect(component.showInformation).toBe(false);
  });
});
