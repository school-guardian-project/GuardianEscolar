import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Stops } from './stops';
import { CitiesService } from '@core/services/cities.service';
import { SchoolsService } from '@core/services/schools.service';
import { RoutesService } from '@core/services/routes.service';
import { StudentsService } from '@core/services/students.service';
import { StopsService } from '@core/services/stops.service';

describe('Stops catalogs', () => {
  const cities = [{ id: 'city-id', name: 'Neiva' }];
  let component: Stops;
  const stops = {
    list: vi.fn(() => of([])),
    create: vi.fn(() => of({ id: 'stop-id' })),
    update: vi.fn(() => of(undefined)),
  };
  const routes = { list: vi.fn(() => of([{ id: 'route-id', name: 'Route' }])), addStop: vi.fn(() => of(undefined)) };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        { provide: CitiesService, useValue: { list: () => of(cities) } },
        { provide: SchoolsService, useValue: { list: () => of([{ id: 'school-id', name: 'School' }]) } },
        { provide: RoutesService, useValue: routes },
        { provide: StudentsService, useValue: { list: () => of([]) } },
        { provide: StopsService, useValue: stops },
      ],
    });
    component = TestBed.runInInjectionContext(() => new Stops());
  });

  it('loads database city labels and submits their identifiers on creation and update', () => {
    component.ngOnInit();
    expect(component.fieldOptions['city']).toEqual(['Neiva']);
    const record = { name: 'Stop', city: 'Neiva', school: 'School', route: 'Route', address: 'Street 123', latitude: 2.9, longitude: -75.2 };
    component.onCreated(record);
    expect(stops.create).toHaveBeenCalledWith(expect.objectContaining({ cityId: 'city-id', schoolId: 'school-id' }));
    component.onSaved({ ...record, id: 'stop-id' });
    expect(stops.update).toHaveBeenCalledWith('stop-id', expect.objectContaining({ cityId: 'city-id' }));
  });

  it('retains database cities when another catalog request fails and reports the failure', () => {
    TestBed.inject(RoutesService).list = vi.fn(() => throwError(() => new Error('Routes unavailable')));
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    component.ngOnInit();
    expect(component.fieldOptions['city']).toEqual(['Neiva']);
    expect(component.fieldOptions['school']).toEqual(['School']);
    expect(component.catalogLoadError).toBe(true);
    expect(stops.list).toHaveBeenCalled();
    log.mockRestore();
  });
});
