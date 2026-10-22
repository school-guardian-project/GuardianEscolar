import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Schools } from './schools';
import { of } from 'rxjs';
import { SchoolsService } from '@core/services/schools.service';
import { CampusesService } from '@core/services/campuses.service';
import { CitiesService } from '@core/services/cities.service';

describe('Schools', () => {
  let component: Schools;
  let fixture: ComponentFixture<Schools>;
  let updateWithCampuses: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    updateWithCampuses = vi.fn(() => of(void 0));
    await TestBed.configureTestingModule({
      imports: [Schools],
      providers: [
        { provide: SchoolsService, useValue: { list: () => of([]), updateWithCampuses } },
        { provide: CampusesService, useValue: {} },
        { provide: CitiesService, useValue: {} },
      ],
    }).overrideComponent(Schools, { set: { template: '' } }).compileComponents();

    fixture = TestBed.createComponent(Schools);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('forwards removed campus ids when saving the school', () => {
    component.onSaved({
      id: 'school-1', name: 'School', city: 'city-1', phone: '3001234567',
      campuses: [{ id: 'campus-2', name: 'North', address: 'North street', latitude: null, longitude: null }],
      removedCampusIds: ['campus-1'],
    });
    expect(updateWithCampuses).toHaveBeenCalledWith('school-1', expect.objectContaining({
      removedCampusIds: ['campus-1'],
      campuses: [expect.objectContaining({ id: 'campus-2' })],
    }));
  });
});
