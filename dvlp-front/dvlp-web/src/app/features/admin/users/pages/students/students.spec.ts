import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { StudentsService } from '@core/services/students.service';

import { Students } from './students';

describe('Students', () => {
  let component: Students;
  let fixture: ComponentFixture<Students>;
  const update = vi.fn(() => of(undefined));

  beforeEach(async () => {
    update.mockClear();
    await TestBed.configureTestingModule({
      imports: [Students],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: StudentsService, useValue: { list: () => of([]), update } },
      ],
    }).overrideComponent(Students, { set: { template: '' } }).compileComponents();

    fixture = TestBed.createComponent(Students);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('allows updating a student without requiring the create-only campus field', () => {
    component.onSaved({
      id: 'student-1',
      names: 'Ana',
      lastNames: 'Pérez',
      documentType: 'TI',
      identification: '123456',
      birthDate: '2010-04-15',
      phone: '3001234567',
      address: 'Calle 1',
      email: 'ana@example.com',
    });

    expect(update).toHaveBeenCalledWith('student-1', expect.objectContaining({
      name: 'Ana',
      lastName: 'Pérez',
    }));
  });
});
