import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRecord } from './update-record';
import { TranslateModule } from '@ngx-translate/core';

describe('UpdateRecord', () => {
  let component: UpdateRecord;
  let fixture: ComponentFixture<UpdateRecord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateRecord, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateRecord);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps campus controls above rows and independently filters inactive campuses before reactivating on save', () => {
    component.type = 'schools';
    component.record = {
      id: 'school-1', name: 'School', city: 'city-1', address: 'School street',
      phone: '3001234567', schooling: 'Primaria', email: 'school@test.com', status: 'Active',
      campuses: [
        { id: 'active', name: 'Main', address: 'Main street', latitude: null, longitude: null, status: 'Active' },
        { id: 'inactive', name: 'North', address: 'North street', latitude: null, longitude: null, status: 'Inactive' },
      ],
    };
    component.ngOnInit();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.modal__campus')).toHaveLength(1);
    const toolbar: HTMLElement = fixture.nativeElement.querySelector('.modal__campus-toolbar');
    expect(toolbar.previousElementSibling?.tagName).toBe('H3');
    expect(toolbar.querySelector('select')?.options.length).toBe(3);
    expect(toolbar.compareDocumentPosition(fixture.nativeElement.querySelector('.modal__campus')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    component.campusFilter = 'Inactive';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.modal__remove-campus')).toBeNull();
    const saved = vi.fn();
    component.saved.subscribe(saved);
    fixture.nativeElement.querySelector('.modal__campus .modal__add-campus').click();
    expect(saved).not.toHaveBeenCalled();
    component.onSubmit();
    expect(saved).toHaveBeenCalledWith(expect.objectContaining({
      campuses: [
        expect.objectContaining({ id: 'active', status: 'Active' }),
        expect.objectContaining({ id: 'inactive', status: 'Active' }),
      ],
    }));
    expect((component.record['campuses'] as { status: string }[])[1].status).toBe('Inactive');
    fixture.detectChanges();
    expect(toolbar.querySelector('select')).toBeNull();
  });

  it('does not silently reactivate hidden campuses when saving school fields', () => {
    component.type = 'schools';
    component.record = {
      name: 'School', city: 'city-1', address: 'School street', phone: '3001234567',
      schooling: 'Primaria', email: 'school@test.com', status: 'Active',
      campuses: [{ id: 'inactive', name: 'North', address: 'North street', status: 'Inactive' }],
    };
    component.ngOnInit();
    const saved = vi.fn();
    component.saved.subscribe(saved);
    component.onSubmit();
    expect(saved).toHaveBeenCalledWith(expect.objectContaining({
      campuses: [expect.objectContaining({ id: 'inactive', status: 'Inactive' })],
    }));
  });

  it('renders a remove button below each saved campus address and submits only its id for removal', () => {
    component.type = 'schools';
    component.record = {
      id: 'school-1', name: 'School', city: 'city-1', address: 'School street',
      phone: '3001234567', schooling: 'Primaria', email: 'school@test.com', status: 'Active',
      campuses: [
        { id: 'campus-1', name: 'Main', address: 'Main street', latitude: null, longitude: null },
        { id: 'campus-2', name: 'North', address: 'North street', latitude: null, longitude: null },
      ],
    };
    component.ngOnInit();
    fixture.detectChanges();
    const buttons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll('.modal__remove-campus');
    expect(buttons.length).toBe(2);
    expect(buttons[0].previousElementSibling?.id).toBe('editCampusAddress0');
    component.campusMapOpenIndex = 1;
    const saved = vi.fn();
    component.saved.subscribe(saved);
    buttons[0].click();
    expect(saved).not.toHaveBeenCalled();
    expect(component.campusMapOpenIndex).toBe(0);
    component.onSubmit();
    expect(saved).toHaveBeenCalledWith(expect.objectContaining({
      removedCampusIds: ['campus-1'],
      campuses: [expect.objectContaining({ id: 'campus-2' })],
    }));
    expect(component.record['campuses']).toHaveLength(2);
  });

  it('does not send new campuses for deactivation and closes the removed campus map', () => {
    component.addCampus();
    component.campusMapOpenIndex = 0;
    component.removeCampus(0);
    expect(component.campuses).toEqual([]);
    expect(component.removedCampusIds).toEqual([]);
    expect(component.campusMapOpenIndex).toBeNull();
  });

  it('keeps all existing children and adds multiple children without duplicates', async () => {
    component.type = 'family';
    component.record = { id: 'family-id', name: 'Family', guardian: 'guardian-id', student: ['Ana', 'Luis'] };
    component.fieldOptions = { student: ['Ana', 'Luis', 'Sofia', 'Carlos'] };
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.selectedStudents).toEqual(['Ana', 'Luis']);
    const picker: HTMLSelectElement = fixture.nativeElement.querySelectorAll('select')[1];
    for (const student of ['Sofia', 'Carlos']) {
      picker.value = student;
      picker.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      await fixture.whenStable();
    }
    component.onFieldChange('student', 'Sofia');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.modal__child').length).toBe(4);
    expect(component.formData['student']).toBe('');
    const saved = vi.fn();
    component.saved.subscribe(saved);
    component.onSubmit();
    expect(saved).toHaveBeenCalledWith(expect.objectContaining({
      id: 'family-id', student: ['Ana', 'Luis', 'Sofia', 'Carlos'],
    }));
  });

  it('uses the separate first-name field when updating a guardian', () => {
    component.type = 'guardian';
    component.record = { names: 'Ana', name: 'Ana Pérez', lastNames: 'Pérez', email: 'ana@test.com', documentType: 'CC',
      identification: '123456', birthDate: '1990-01-01', phone: '3001234567', address: 'Calle 123' };
    component.ngOnInit();
    expect(component.fields[0].name).toBe('names');
    component.formData['names'] = 'Ana María';
    const saved = vi.fn();
    component.saved.subscribe(saved);

    component.onSubmit();

    expect(saved).toHaveBeenCalledWith(expect.objectContaining({
      names: 'Ana María',
      lastNames: 'Pérez',
    }));
  });

  it('removes only the selected child and keeps unknown existing child identifiers', () => {
    component.type = 'family';
    component.record = { name: 'Family', guardian: 'guardian-id', student: ['unknown-profile-id', 'Ana'] };
    component.ngOnInit();
    component.removeStudent('Ana');
    const saved = vi.fn();
    component.saved.subscribe(saved);
    component.onSubmit();
    expect(saved).toHaveBeenCalledWith(expect.objectContaining({ student: ['unknown-profile-id'] }));
  });

  it('shows save errors inside the open modal', () => {
    component.saveError = 'The selected child belongs to another family.';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(component.saveError);
  });

  it('keeps children with identical names as separate profiles', () => {
    component.type = 'family';
    component.record = { name: 'Family', guardian: 'guardian-id', student: ['first-profile', 'second-profile'] };
    component.fieldOptions = { student: ['first-profile', 'second-profile', 'third-profile'] };
    component.fieldOptionLabels = { student: {
      'first-profile': 'Ana Test', 'second-profile': 'Ana Test', 'third-profile': 'Ana Test',
    } };
    fixture.detectChanges();
    component.onFieldChange('student', 'third-profile');
    fixture.detectChanges();
    expect(component.selectedStudents).toEqual(['first-profile', 'second-profile', 'third-profile']);
    const chips = fixture.nativeElement.querySelectorAll('.modal__child span');
    expect(chips.length).toBe(3);
    expect([...chips].every(chip => (chip as HTMLElement).textContent?.trim() === 'Ana Test')).toBe(true);
    component.removeStudent('second-profile');
    const saved = vi.fn();
    component.saved.subscribe(saved);
    component.onSubmit();
    expect(saved).toHaveBeenCalledWith(expect.objectContaining({ student: ['first-profile', 'third-profile'] }));
  });
});
