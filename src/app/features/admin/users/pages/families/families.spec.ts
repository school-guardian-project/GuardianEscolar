import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Families } from './families';
import { FamiliesService } from '@core/services/families.service';
import { ParentsService } from '@core/services/parents.service';
import { StudentsService } from '@core/services/students.service';

describe('Families editing', () => {
  let component: Families;
  const service = {
    list: vi.fn(() => of([])),
    get: vi.fn(() => of({ id: 'family-id', name: 'Family', parentProfileId: 'parent-profile', description: '', children: ['first-profile', 'second-profile'] })),
    update: vi.fn(() => of(undefined)),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        { provide: FamiliesService, useValue: service },
        { provide: ParentsService, useValue: { list: () => of([{ id: 'parent', profileId: 'parent-profile', name: 'Parent', lastName: 'Test' }]) } },
        { provide: StudentsService, useValue: { list: () => of([
          { id: 'first', profileId: 'first-profile', name: 'Ana', lastName: 'Test' },
          { id: 'second', profileId: 'second-profile', name: 'Luis', lastName: 'Test' },
          { id: 'third', profileId: 'third-profile', name: 'Sofia', lastName: 'Test' },
        ]) } },
      ],
    });
    component = TestBed.runInInjectionContext(() => new Families());
    component.ngOnInit();
  });

  it('opens every existing child and saves added children using profile IDs', () => {
    component.showUpdate({ id: 'family-id' });
    expect(component.familyToUpdate['student']).toEqual(['first-profile', 'second-profile']);
    component.onSaved({ ...component.familyToUpdate, student: ['first-profile', 'second-profile', 'third-profile', 'third-profile'] });
    expect(service.update).toHaveBeenCalledWith('family-id', {
      familyName: 'Family', observations: '', members: [
        { profileId: 'parent-profile', relationshipType: 'Parent' },
        { profileId: 'first-profile', relationshipType: 'Student' },
        { profileId: 'second-profile', relationshipType: 'Student' },
        { profileId: 'third-profile', relationshipType: 'Student' },
      ],
    });
    expect(component.showUpdateModal).toBe(false);
  });

  it('keeps the modal open with an explicit error when saving fails', () => {
    TestBed.inject(FamiliesService).update = vi.fn(() => throwError(() => new Error('Save failed')));
    component.showUpdate({ id: 'family-id' });
    component.onSaved(component.familyToUpdate);
    expect(component.showUpdateModal).toBe(true);
    expect(component.updateError).not.toBe('');
  });

  it('does not re-add a removed child', () => {
    component.showUpdate({ id: 'family-id' });
    component.onSaved({ ...component.familyToUpdate, student: ['second-profile'] });
    expect(service.update).toHaveBeenCalledWith('family-id', expect.objectContaining({
      members: [
        { profileId: 'parent-profile', relationshipType: 'Parent' },
        { profileId: 'second-profile', relationshipType: 'Student' },
      ],
    }));
  });

  it('reports missing children without submitting an invalid family', () => {
    component.showUpdate({ id: 'family-id' });
    component.onSaved({ ...component.familyToUpdate, student: [] });
    expect(service.update).not.toHaveBeenCalled();
    expect(component.showUpdateModal).toBe(true);
    expect(component.updateError).not.toBe('');
  });
});
