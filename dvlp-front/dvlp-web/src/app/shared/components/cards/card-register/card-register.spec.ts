import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '@core/services/auth.service';
import { CampusesService } from '@core/services/campuses.service';
import { CitiesService } from '@core/services/cities.service';
import { SchoolsService } from '@core/services/schools.service';
import { VehicleTypesService } from '@core/services/vehicle-types.service';

import { CardRegister } from './card-register';

describe('CardRegister', () => {
  let component: CardRegister;
  let fixture: ComponentFixture<CardRegister>;

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
});
