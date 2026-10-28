import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RoutesService } from '@core/services/routes.service';
import { CampusesService } from '@core/services/campuses.service';
import { AuthService } from '@core/services/auth.service';

import { RoutesPage } from './routes';

describe('RoutesPage', () => {
  let component: RoutesPage;
  let fixture: ComponentFixture<RoutesPage>;
  const routesService = {
    list: vi.fn(() => of([])),
    create: vi.fn(() => of(undefined)),
    update: vi.fn(() => of(undefined)),
    get: vi.fn(() => of({
      id: 'route-id',
      name: 'Morning route',
      campuseId: 'campus-id',
      targetSector: 'North sector',
      startTime: '07:00:00',
      endTime: '08:00:00',
      daysOfWeek: ['Monday', 'Wednesday'],
      status: 'Active' as const,
    })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutesPage],
      providers: [
        { provide: RoutesService, useValue: routesService },
        { provide: CampusesService, useValue: { listBySchool: () => of([]) } },
        { provide: AuthService, useValue: { session: { schoolId: 'school-id' } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RoutesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sends selected workdays when creating and updating a route', () => {
    component.onCreated({
      name: 'Morning route',
      campus: 'campus-id',
      destination: 'North sector',
      startTime: '07:00',
      endTime: '08:00',
      daysOfWeek: ['Monday', 'Wednesday'],
    });

    expect(routesService.create).toHaveBeenCalledWith(expect.objectContaining({
      daysOfWeek: ['Monday', 'Wednesday'],
    }));

    component.showUpdateDetails({ id: 'route-id' });
    expect(component.routeSelected['daysOfWeek']).toEqual(['Monday', 'Wednesday']);

    component.onSaved({
      ...component.routeSelected,
      daysOfWeek: ['Tuesday', 'Thursday'],
    });

    expect(routesService.update).toHaveBeenCalledWith('route-id', expect.objectContaining({
      daysOfWeek: ['Tuesday', 'Thursday'],
    }));
  });
});
