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

  it('keeps all existing children and adds multiple children without duplicates', async () => {
    component.type = 'family';
    component.record = { id: 'family-id', name: 'Family', student: ['Ana', 'Luis'] };
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

  it('removes only the selected child and keeps unknown existing child identifiers', () => {
    component.type = 'family';
    component.record = { student: ['unknown-profile-id', 'Ana'] };
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
    component.record = { student: ['first-profile', 'second-profile'] };
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
