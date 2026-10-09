import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CitiesService } from '@core/services/cities.service';
import { CampusesService } from '@core/services/campuses.service';
import { SchoolsService } from '@core/services/schools.service';

import { UpdateInformation } from './update-information';

describe('UpdateInformation', () => {
  let component: UpdateInformation;
  let fixture: ComponentFixture<UpdateInformation>;
  let updateWithCampuses: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    updateWithCampuses = vi.fn(() => of(void 0));
    await TestBed.configureTestingModule({
      imports: [UpdateInformation],
      providers: [
        {
          provide: SchoolsService,
          useValue: {
            get: () => of({
              id: 'school-1',
              name: 'School',
              address: 'School address',
              latitude: 4.5,
              longitude: -74.1,
              cityId: 'city-1',
              cityName: 'City',
              logo: '',
              phone: 123456,
              email: 'school@example.invalid',
              status: 'Active',
            }),
            updateWithCampuses,
          },
        },
        {
          provide: CampusesService,
          useValue: {
            listBySchool: () => of([{
              id: 'campus-1',
              name: 'Main campus',
              address: 'Campus address',
              latitude: 4.6,
              longitude: -74.2,
            }]),
          },
        },
        { provide: CitiesService, useValue: { list: () => of([{ id: 'city-1', name: 'City' }]) } },
      ],
    }).overrideComponent(UpdateInformation, { set: { template: '' } }).compileComponents();

    fixture = TestBed.createComponent(UpdateInformation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads school campuses and saves their map coordinates together', () => {
    component.schoolId = 'school-1';
    component.ngOnInit();

    expect(component.nombreEscuela).toBe('School');
    expect(component.campuses[0].id).toBe('campus-1');
    expect(component.cities[0].id).toBe('city-1');

    component.updateCampusLocation(0, { latitude: 4.7, longitude: -74.3 });
    component.update();

    expect(updateWithCampuses).toHaveBeenCalledWith('school-1', expect.objectContaining({
      latitude: 4.5,
      longitude: -74.1,
      campuses: [{
        id: 'campus-1',
        name: 'Main campus',
        address: 'Campus address',
        latitude: 4.7,
        longitude: -74.3,
      }],
    }));
  });

  it('saves school information when it has no additional campuses', () => {
    component.schoolId = 'school-1';
    component.ngOnInit();
    component.campuses = [];

    component.update();

    expect(updateWithCampuses).toHaveBeenCalledWith('school-1', expect.objectContaining({
      campuses: [],
    }));
  });
});
