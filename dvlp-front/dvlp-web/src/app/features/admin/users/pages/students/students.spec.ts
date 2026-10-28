import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { StudentsService } from '@core/services/students.service';
import { PersonResponseDto } from '@core/models/student.model';

import { Students } from './students';

describe('Students', () => {
  let component: Students;
  let fixture: ComponentFixture<Students>;
  const update = vi.fn(() => of(undefined));
  const get = vi.fn();

  beforeEach(async () => {
    update.mockClear();
    get.mockReset();
    await TestBed.configureTestingModule({
      imports: [Students],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: StudentsService, useValue: { list: () => of([]), update, get } },
      ],
    }).overrideComponent(Students, { set: { template: '' } }).compileComponents();

    fixture = TestBed.createComponent(Students);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  for (const profileId of [undefined, null, '22222222-2222-2222-2222-222222222222']) {
    it(`preserves the profile when opening student details with API profile ${profileId}`, () => {
      const listProfileId = '11111111-1111-1111-1111-111111111111';
      const detail: PersonResponseDto = {
        id: '33333333-3333-3333-3333-333333333333',
        profileId, name: 'Ana', lastName: 'Perez', identificationNumber: '123456',
        email: 'ana@example.com', phone: 3001234567, identificationType: 0,
        residenceAddress: 'Calle 1', dateBirth: '2010-04-15',
      };
      get.mockReturnValue(of(detail));
      component.showDetails({ id: detail.id, profileId: listProfileId });
      expect(component.showModal).toBe(true);
      component.showAssign(component.studentSelected);
      expect(component.studentSelected['profileId']).toBe(profileId ?? listProfileId);
      expect(component.showAssignModal).toBe(true);
    });
  }

  it('allows updating a student without requiring the create-only campus field', () => {
    component.onSaved({
      id: 'student-1',
      names: 'Ana',
      lastNames: 'Pérez',
      documentType: 'TI',
      identification: '123456',
      birthDate: '2010-04-15',
      phone: '3001234567',
      address: 'Calle 1',
      email: 'ana@example.com',
    });

    expect(update).toHaveBeenCalledWith('student-1', expect.objectContaining({
      name: 'Ana',
      lastName: 'Pérez',
    }));
  });
});
