import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
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
      imports: [UpdateInformation, TranslateModule.forRoot()],
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
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateInformation);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('associates each campus input with a unique visible label', () => {
    component.schoolId = 'school-1';
    component.ngOnInit();
    component.addCampus();
    fixture.detectChanges();

    const inputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('.modal__campus input');
    expect(inputs).toHaveLength(4);
    expect(new Set(Array.from(inputs, input => input.id)).size).toBe(4);
    for (const input of Array.from(inputs)) {
      expect(input.id).not.toBe('');
      const label: HTMLLabelElement = fixture.nativeElement.querySelector(`label[for="${input.id}"]`);
      expect(label).not.toBeNull();
      expect(label.control).toBe(input);
      expect(label.textContent?.trim()).not.toBe('');
    }
  });

  it('filters only this school campuses and saves explicit reactivation without changing the input records', () => {
    component.schoolId = 'school-1';
    component.ngOnInit();
    component.campuses.push({
      id: 'inactive', name: 'North', address: 'North street', latitude: null, longitude: null, status: 'Inactive',
    });
    fixture.detectChanges();
    const toolbar: HTMLElement = fixture.nativeElement.querySelector('.modal__campus-toolbar');
    expect(toolbar.previousElementSibling?.tagName).toBe('H3');
    expect(toolbar.querySelector('select')?.options.length).toBe(3);
    expect(fixture.nativeElement.querySelectorAll('.modal__campus')).toHaveLength(1);
    component.campusFilter = 'Inactive';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.modal__remove-campus')).toBeNull();
    fixture.nativeElement.querySelector('.modal__campus .modal__add-campus').click();
    expect(updateWithCampuses).not.toHaveBeenCalled();
    component.update();
    expect(updateWithCampuses).toHaveBeenCalledWith('school-1', expect.objectContaining({
      campuses: [
        expect.objectContaining({ id: 'campus-1', status: 'Active' }),
        expect.objectContaining({ id: 'inactive', status: 'Active' }),
      ],
    }));
  });

  it('hides filters for active-only campuses and never persists reactivation on cancel', () => {
    component.schoolId = 'school-1';
    component.ngOnInit();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.modal__campus-toolbar select')).toBeNull();
    component.campuses[0].status = 'Inactive';
    component.reactivateCampus(0);
    component.close();
    expect(updateWithCampuses).not.toHaveBeenCalled();
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
        status: 'Active',
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

  it('places the remove button below the address and only removes the clicked campus on save', () => {
    component.schoolId = 'school-1';
    component.ngOnInit();
    component.addCampus();
    component.campuses[1] = {
      id: 'campus-2', name: 'North', address: 'North street', latitude: null, longitude: null,
    };
    component.campusMaps = [false, false];
    fixture.detectChanges();
    const campus: HTMLElement = fixture.nativeElement.querySelector('.modal__campus');
    const button = campus.querySelector<HTMLButtonElement>('.modal__remove-campus')!;
    expect(button.previousElementSibling?.querySelector('input')).not.toBeNull();

    component.campusMaps[1] = true;
    button.click();

    expect(updateWithCampuses).not.toHaveBeenCalled();
    expect(component.campuses.map(campus => campus.id)).toEqual(['campus-2']);
    expect(component.campusMaps).toEqual([true]);
    component.update();
    expect(updateWithCampuses).toHaveBeenCalledWith('school-1', expect.objectContaining({
      removedCampusIds: ['campus-1'],
      campuses: [expect.objectContaining({ id: 'campus-2' })],
    }));
  });

  it('does not deactivate new unsaved campuses or persist removals when cancelled', () => {
    component.schoolId = 'school-1';
    component.ngOnInit();
    component.addCampus();
    component.removeCampus(1);
    expect(component.removedCampusIds).toEqual([]);
    component.removeCampus(0);
    component.close();
    expect(updateWithCampuses).not.toHaveBeenCalled();
    expect(component.removedCampusIds).toEqual([]);
  });
});
