import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Schools } from './schools';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SchoolsService } from '@core/services/schools.service';
import { CampusesService } from '@core/services/campuses.service';
import { CitiesService } from '@core/services/cities.service';

describe('Schools', () => {
  let component: Schools;
  let fixture: ComponentFixture<Schools>;
  let updateWithCampuses: ReturnType<typeof vi.fn>;
  let reactivate: ReturnType<typeof vi.fn>;
  let list: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    updateWithCampuses = vi.fn(() => of(void 0));
    reactivate = vi.fn(() => of(void 0));
    list = vi.fn(() => of([]));
    await TestBed.configureTestingModule({
      imports: [Schools],
      providers: [
        { provide: SchoolsService, useValue: { list, updateWithCampuses, reactivate } },
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

  it('reloads schools after successful reactivation', () => {
    component.reactivate({ id: 'school-1', status: 'Inactive' });
    expect(reactivate).toHaveBeenCalledWith('school-1');
    expect(list).toHaveBeenCalled();
    expect(component.reactivating).toBe(false);
  });

  it('shows reactivation failures without pretending the school was reactivated', () => {
    reactivate.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
    component.reactivate({ id: 'school-1', status: 'Inactive' });
    expect(component.actionError).toBe('No se pudo reactivar el colegio.');
    expect(component.reactivating).toBe(false);
    expect(list).not.toHaveBeenCalled();
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
