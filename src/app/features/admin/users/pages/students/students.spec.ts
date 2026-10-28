import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { RoutesService } from '@core/services/routes.service';
import { RouteResponseDto } from '@core/models/route.model';
import { StudentsService } from '@core/services/students.service';
import { PersonResponseDto } from '@core/models/student.model';

import { Students } from './students';

describe('Students', () => {
  let component: Students;
  let fixture: ComponentFixture<Students>;
  const update = vi.fn(() => of(undefined));
  const get = vi.fn();
  const getStudentRoute = vi.fn();
  const getStudentStop = vi.fn();

  beforeEach(async () => {
    update.mockClear();
    get.mockReset();
    getStudentRoute.mockReset().mockReturnValue(throwError(() => new HttpErrorResponse({
      status: 404,
    })));
    getStudentStop.mockReset();
    await TestBed.configureTestingModule({
      imports: [Students],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: StudentsService, useValue: { list: () => of([]), update, get } },
        { provide: RoutesService, useValue: { getStudentRoute, getStudentStop } },
      ],
    }).overrideComponent(Students, { set: { template: '' } }).compileComponents();

    fixture = TestBed.createComponent(Students);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const student: PersonResponseDto = {
    id: 'person-1', profileId: '11111111-1111-1111-1111-111111111111',
    name: 'Ana', lastName: 'Perez', identificationNumber: '123456',
    email: 'ana@example.com', phone: 3001234567, identificationType: 0,
    residenceAddress: 'Calle 1', dateBirth: '2010-04-15',
  };
  const route: RouteResponseDto = {
    id: 'route-1', name: 'North route', campuseId: 'campus-1',
    targetSector: 'School', startTime: '06:00:00', endTime: '08:00:00',
    status: 'Active', bus: { id: 'bus-1', plate: 'ABC123' },
  };

  it('reads and displays the saved route, assigned stop and bus for the student profile', () => {
    get.mockReturnValue(of(student));
    getStudentRoute.mockReturnValue(of(route));
    getStudentStop.mockReturnValue(of({ stopName: 'Home stop' }));
    component.showDetails({ id: student.id });
    expect(getStudentRoute).toHaveBeenCalledWith(student.profileId);
    expect(getStudentStop).toHaveBeenCalledWith(route.id, student.profileId);
    expect(component.studentSelected).toEqual(expect.objectContaining({
      route: 'North route', stop: 'Home stop', busPlate: 'ABC123',
    }));
  });

  it('distinguishes an unassigned profile from a failed assignment query', () => {
    get.mockReturnValue(of(student));
    component.showDetails({ id: student.id });
    expect(component.studentSelected['route']).toBe('record_information.student.unassigned');
    getStudentRoute.mockReturnValue(throwError(() => new HttpErrorResponse({
      status: 409, error: { detail: 'Route dependency unavailable' },
    })));
    component.showDetails({ id: student.id });
    expect(component.actionError).toBe('Route dependency unavailable');
    expect(component.studentSelected['route']).toBeUndefined();
  });

  it('does not apply an old route response to a different or closed student detail', () => {
    const pending = new Subject<RouteResponseDto>();
    get.mockReturnValue(of(student));
    getStudentRoute.mockReturnValue(pending);
    component.showDetails({ id: student.id });
    component.closeModal();
    pending.next(route);
    expect(getStudentStop).not.toHaveBeenCalled();
    expect(component.studentSelected).toEqual({});
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
