import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Stops } from './stops';
import { CitiesService } from '@core/services/cities.service';
import { SchoolsService } from '@core/services/schools.service';
import { RoutesService } from '@core/services/routes.service';
import { StudentsService } from '@core/services/students.service';
import { StopsService } from '@core/services/stops.service';
import { CardRegister } from '@shared/components/cards/card-register/card-register';
import { HttpErrorResponse } from '@angular/common/http';

describe('Stops catalogs', () => {
  const profileId = 'c0d421f6-1247-4e16-ad3b-dcfa38f4303c';
  const cities = [{ id: 'city-id', name: 'Neiva' }];
  let component: Stops;
  const stops = {
    list: vi.fn(() => of([])),
    create: vi.fn(() => of({ id: 'stop-id' })),
    update: vi.fn(() => of(undefined)),
  };
  const routes = {
    list: vi.fn(() => of([{ id: 'route-id', name: 'Route' }])),
    addStop: vi.fn(() => of(undefined)),
    assignStudent: vi.fn(() => of(undefined)),
  };
  const students = {
    list: () =>
      of([
        { id: 'person-1', profileId, name: 'Ana', lastName: 'Perez', identificationNumber: '123' },
        {
          id: 'person-2',
          profileId: null,
          name: 'Ana',
          lastName: 'Perez',
          identificationNumber: '456',
        },
        {
          id: 'person-3',
          profileId: 'not-a-guid',
          name: 'Ana',
          lastName: 'Perez',
          identificationNumber: '789',
        },
        {
          id: 'person-4',
          profileId: '00000000-0000-0000-0000-000000000000',
          name: 'Ana',
          lastName: 'Perez',
          identificationNumber: '999',
        },
      ]),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    routes.list.mockImplementation(() => of([{ id: 'route-id', name: 'Route' }]));
    routes.addStop.mockImplementation(() => of(undefined));
    routes.assignStudent.mockImplementation(() => of(undefined));
    TestBed.configureTestingModule({
      providers: [
        { provide: CitiesService, useValue: { list: () => of(cities) } },
        {
          provide: SchoolsService,
          useValue: { list: () => of([{ id: 'school-id', name: 'School' }]) },
        },
        { provide: RoutesService, useValue: routes },
        { provide: StudentsService, useValue: students },
        { provide: StopsService, useValue: stops },
      ],
    });
    component = TestBed.runInInjectionContext(() => new Stops());
  });

  const record = {
    name: 'Stop',
    city: 'Neiva',
    school: 'School',
    route: 'Route',
    address: 'Street 123',
    latitude: 2.9,
    longitude: -75.2,
  };

  it('creates the stop, links the route and then assigns the selected student profile', () => {
    component.ngOnInit();
    expect(component.fieldOptions['student']).toEqual([
      'Ana Perez (123)',
      'Ana Perez (456)',
      'Ana Perez (789)',
      'Ana Perez (999)',
    ]);
    component.onCreated({ ...record, student: 'Ana Perez (123)' });
    expect(routes.addStop).toHaveBeenCalledWith('route-id', 'stop-id');
    expect(routes.assignStudent).toHaveBeenCalledWith('route-id', {
      studentId: profileId,
      stopId: 'stop-id',
    });
    expect(routes.addStop.mock.invocationCallOrder[0]).toBeLessThan(
      routes.assignStudent.mock.invocationCallOrder[0]
    );
  });

  it.each(['456', '789', '999', 'unknown'])(
    'rejects an invalid selected profile (%s) before creating a stop',
    (identification) => {
      component.ngOnInit();
      component.onCreated({ ...record, student: `Ana Perez (${identification})` });
      expect(stops.create).not.toHaveBeenCalled();
      expect(routes.assignStudent).not.toHaveBeenCalled();
    }
  );

  it('does not assign a student when route attachment fails', () => {
    component.ngOnInit();
    routes.addStop.mockReturnValue(throwError(() => new Error('Attachment failed')));
    component.onCreated({ ...record, student: 'Ana Perez (123)' });
    expect(routes.assignStudent).not.toHaveBeenCalled();
  });

  it('assigns the selected profile when editing an existing stop', () => {
    component.ngOnInit();
    component.stopSelected = { id: 'stop-id', routeId: 'route-id' };
    component.onSaved({ ...record, id: 'stop-id', student: 'Ana Perez (123)' });
    expect(stops.update).toHaveBeenCalled();
    expect(routes.assignStudent).toHaveBeenCalledWith('route-id', {
      studentId: profileId,
      stopId: 'stop-id',
    });
  });

  it('reports assignment failure without undoing a successfully updated stop', () => {
    component.ngOnInit();
    routes.assignStudent.mockReturnValue(throwError(() => new Error('Assignment failed')));
    component.stopSelected = { id: 'stop-id', routeId: 'route-id' };
    component.showUpdateModal = true;
    component.onSaved({ ...record, id: 'stop-id', student: 'Ana Perez (123)' });
    expect(component.actionError).toContain('no se pudo asignar el estudiante');
    expect(component.showUpdateModal).toBe(true);
    expect(component.stopSelected).toEqual(
      expect.objectContaining({
        student: 'Ana Perez (123)',
        routeId: 'route-id',
        name: record.name,
      })
    );
  });

  it('rejects a student without a route before any write', () => {
    component.ngOnInit();
    component.onCreated({ ...record, route: '', student: 'Ana Perez (123)' });
    expect(stops.create).not.toHaveBeenCalled();
    component.stopSelected = { id: 'stop-id' };
    component.onSaved({ ...record, id: 'stop-id', route: '', student: 'Ana Perez (123)' });
    expect(stops.update).not.toHaveBeenCalled();
    expect(component.actionError).toContain('Selecciona una ruta');
  });

  it('keeps route-only registration and updates without assigning a student', () => {
    component.ngOnInit();
    component.onCreated(record);
    component.onSaved({ ...record, id: 'stop-id' });
    expect(stops.create).toHaveBeenCalled();
    expect(stops.update).toHaveBeenCalled();
    expect(routes.assignStudent).not.toHaveBeenCalled();
  });

  it('reports the saved stop and failed assignment even with a backend error detail', () => {
    component.ngOnInit();
    component.register = TestBed.runInInjectionContext(() => new CardRegister());
    const reset = vi.spyOn(component.register, 'resetForm');
    const message = vi.spyOn(component.register, 'setValidationMessage');
    routes.assignStudent.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 400,
            error: { detail: 'Student profile not found' },
          })
      )
    );
    component.onCreated({ ...record, student: 'Ana Perez (123)' });
    expect(reset).toHaveBeenCalledOnce();
    expect(message).toHaveBeenCalledWith(
      expect.stringContaining('La parada y la ruta se guardaron')
    );
    expect(message).toHaveBeenCalledWith(expect.stringContaining('Student profile not found'));
    expect(stops.create).toHaveBeenCalledOnce();
  });
  it('loads database city labels and submits their identifiers on creation and update', () => {
    component.ngOnInit();
    expect(component.fieldOptions['city']).toEqual(['Neiva']);
    const record = {
      name: 'Stop',
      city: 'Neiva',
      school: 'School',
      route: 'Route',
      address: 'Street 123',
      latitude: 2.9,
      longitude: -75.2,
    };
    component.onCreated(record);
    expect(stops.create).toHaveBeenCalledWith(
      expect.objectContaining({ cityId: 'city-id', schoolId: 'school-id' })
    );
    component.onSaved({ ...record, id: 'stop-id' });
    expect(stops.update).toHaveBeenCalledWith(
      'stop-id',
      expect.objectContaining({ cityId: 'city-id' })
    );
  });

  it('retains database cities when another catalog request fails and reports the failure', () => {
    TestBed.inject(RoutesService).list = vi.fn(() =>
      throwError(() => new Error('Routes unavailable'))
    );
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    component.ngOnInit();
    expect(component.fieldOptions['city']).toEqual(['Neiva']);
    expect(component.fieldOptions['school']).toEqual(['School']);
    expect(component.catalogLoadError).toBe(true);
    expect(stops.list).toHaveBeenCalled();
    log.mockRestore();
  });
});
