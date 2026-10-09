import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '@core/services/auth.service';
import { CampusesService } from '@core/services/campuses.service';
import { CitiesService } from '@core/services/cities.service';
import { SchoolsService } from '@core/services/schools.service';
import { VehicleTypesService } from '@core/services/vehicle-types.service';
import { of, Subject } from 'rxjs';
import type { CampusListDto } from '@core/services/campuses.service';
import { NgModel } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { CardRegister } from './card-register';

describe('CardRegister', () => {
  let component: CardRegister;
  let fixture: ComponentFixture<CardRegister>;
  const campusControl = () => fixture.debugElement.queryAll(By.directive(NgModel))
    .find(element => element.injector.get(NgModel).name === 'campus');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardRegister, TranslateModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: { session: { schoolId: null } } },
        { provide: CampusesService, useValue: {} },
        { provide: CitiesService, useValue: {} },
        { provide: SchoolsService, useValue: {} },
        { provide: VehicleTypesService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CardRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('validates school fields as values change', () => {
    component.type = 'schools';
    component.formData = { name: '', website: '' };

    component.onInputChange('name', 'A');
    expect(component.getFieldError('name')).toBe('validation.minLength');

    component.onInputChange('website', 'not a website');
    expect(component.getFieldError('website')).toBe('validation.url');

    component.onInputChange('website', 'school.example');
    expect(component.getFieldError('website')).toBe('');
  });

  it('validates campus details as values change', () => {
    component.type = 'schools';
    component.campuses = [{ name: '', address: '', latitude: null, longitude: null }];

    component.onCampusNameChange(0, 'Main campus');
    expect(component.campusNamesError).toBe('register.schools.campusAddressRequired');

    component.onCampusAddressChange(0, '123 Main Street');
    expect(component.campusNamesError).toBe('');
  });

  it('shows missing school fields without requiring a campus on submit', () => {
    component.type = 'schools';
    component.formData = {};

    component.onSubmit();

    expect(component.getFieldError('name')).toBe('validation.required');
    expect(component.getFieldError('city')).toBe('validation.required');
    expect(component.campusNamesError).toBe('');
    expect(component.campuses).toEqual([]);
  });

  it('submits a school without additional campuses when all required fields are valid', () => {
    component.type = 'schools';
    component.formData = {
      name: 'Central School',
      city: 'city-id',
      address: '123 Main Street',
      phone: '3001234567',
      schooling: 'Primaria',
      email: 'school@example.com',
      website: '',
    };
    const submit = vi.fn();
    component.formSubmit.subscribe(submit);

    component.onSubmit();

    expect(submit).toHaveBeenCalledWith(expect.objectContaining({ campuses: [] }));
    expect(component.campusNamesError).toBe('');
  });

  it('encodes the selected logo as base64 bytes for the API', async () => {
    component.formData = { logo: '' };
    const file = new File(['school logo'], 'logo.png', { type: 'image/png' });
    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: [file] });

    component.onLogoSelected({ target: input } as unknown as Event);
    await vi.waitFor(() => expect(component.formData['logo']).toBe('c2Nob29sIGxvZ28='));
  });

  it('allows removing the only additional campus', () => {
    component.addCampusName();
    component.removeCampusName(0);
    expect(component.campuses).toEqual([]);
  });

  for (const type of ['student', 'guardian', 'driver'] as const) {
    it(`automatically assigns the sole campus and hides its selector for ${type}`, () => {
      component.type = type;
      const auth = TestBed.inject(AuthService);
      Object.assign(auth.session, {
        profileId: null, personId: null, email: null, schoolId: 'school-id', campusId: null,
      });
      const campuses = TestBed.inject(CampusesService);
      campuses.listBySchool = vi.fn().mockReturnValue(of([
        { id: 'central-id', name: 'Sede central', address: 'Central address', latitude: null, longitude: null },
      ]));
      component.loadCampuses();
      fixture.detectChanges();

      expect(campusControl()).toBeUndefined();
      expect(component.formData['campus']).toBe('central-id');
      Object.assign(component.formData, {
        names: 'Ana', lastNames: 'Perez', documentType: 'CC', identification: '123456',
        birthDate: '2000-01-01', phone: '3001234567', address: 'Central street 123',
        email: 'ana@example.com', licenseExpiration: '2099-01-01', licenseNumber: '123456',
      });
      const submit = vi.fn();
      component.formSubmit.subscribe(submit);
      component.onSubmit();
      expect(component.fieldErrors['campus']).toBeUndefined();
      expect(submit).toHaveBeenCalledWith(expect.objectContaining({ campus: 'central-id' }));

      component.resetForm();
      expect(component.formData['campus']).toBe('central-id');
    });
  }

  it('keeps the selector while loading, without campuses, and with multiple campuses', () => {
    component.type = 'student';
    Object.assign(TestBed.inject(AuthService).session, {
      profileId: null, personId: null, email: null, schoolId: 'school-id', campusId: null,
    });
    const response = new Subject<CampusListDto[]>();
    TestBed.inject(CampusesService).listBySchool = vi.fn().mockReturnValue(response);
    component.ngOnChanges();
    component.loadCampuses();
    fixture.detectChanges();
    expect(campusControl()).toBeDefined();
    response.next([]);
    fixture.detectChanges();
    expect(campusControl()).toBeDefined();
    response.next([
      { id: 'central-id', name: 'Sede central', address: 'Central address', latitude: null, longitude: null },
      { id: 'north-id', name: 'North', address: 'North address', latitude: null, longitude: null },
    ]);
    fixture.detectChanges();
    expect(campusControl()).toBeDefined();
    expect(component.formData['campus']).toBe('');
  });

  it('restores the selector when reloading campuses fails', () => {
    component.type = 'student';
    Object.assign(TestBed.inject(AuthService).session, { schoolId: 'school-id' });
    const response = new Subject<CampusListDto[]>();
    TestBed.inject(CampusesService).listBySchool = vi.fn().mockReturnValue(response);
    component.loadCampuses();
    response.next([
      { id: 'central-id', name: 'Sede central', address: 'Central address', latitude: null, longitude: null },
    ]);
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    response.error(new Error('Campus request failed'));
    fixture.detectChanges();
    expect(campusControl()).toBeDefined();
    expect(component.optionsLoadError['campus']).toBe(true);
    log.mockRestore();
  });

  it('does not hide the campus field for bus registration', () => {
    component.type = 'bus';
    Object.assign(TestBed.inject(AuthService).session, { schoolId: 'school-id' });
    TestBed.inject(CampusesService).listBySchool = vi.fn().mockReturnValue(of([
      { id: 'central-id', name: 'Sede central', address: 'Central address', latitude: null, longitude: null },
    ]));
    component.loadCampuses();
    expect(component.groupedFields.some(group => group.name === 'campus')).toBe(true);
    expect(component.formData['campus']).not.toBe('central-id');
  });
});
