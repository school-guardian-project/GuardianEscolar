import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subject, throwError } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { SchoolsService } from '@core/services/schools.service';
import { SchoolResponseDto } from '@core/models/school.model';
import { RecordInformation } from '@shared/components/modal/record-information/record-information';

import { DashboardAdmin } from './dashboard-admin';

describe('DashboardAdmin', () => {
  let component: DashboardAdmin;
  let fixture: ComponentFixture<DashboardAdmin>;
  let getSchool: ReturnType<typeof vi.fn>;
  let session: { schoolId: string | null };
  const school: SchoolResponseDto = {
    id: 'school-1', cityId: 'city-1', cityName: 'Neiva',
    name: 'Colegio Central', address: 'Calle 10 # 5-20', logo: '',
    phone: 3001234567, email: 'central@example.com',
    website: 'https://central.example.com', theme: 'Primaria', status: 'Active',
  };

  beforeEach(async () => {
    session = { schoolId: 'school-1' };
    getSchool = vi.fn(() => of(school));
    await TestBed.configureTestingModule({
      imports: [DashboardAdmin, RecordInformation, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { session } },
        { provide: SchoolsService, useValue: { get: getSchool } },
      ],
    }).overrideComponent(DashboardAdmin, { set: { template: '' } }).compileComponents();

    fixture = TestBed.createComponent(DashboardAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
    session.schoolId = null;
    component.showDetails();

    expect(getSchool).not.toHaveBeenCalled();
    expect(component.showInformation).toBe(false);
    expect(component.schoolErrorKey).toBe('dashboard.schoolInformation.noSchool');
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
