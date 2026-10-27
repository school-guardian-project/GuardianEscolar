import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Admins } from './admins';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminsService } from '../../services/admins.service';
import { CitiesService } from '@core/services/cities.service';
import { SchoolsService } from '@core/services/schools.service';
import { DeleteRecord } from '@shared/components/modal/delete-record/delete-record';

describe('Admins', () => {
  let component: Admins;
  let fixture: ComponentFixture<Admins>;
  const admin = {
    id: 'admin-1', name: ' Maria Elena ', lastName: ' Perez Gomez ',
    identificationNumber: '123', email: 'admin@example.com', phone: 3001234567,
    cityId: null, schoolId: null,
  };
  let service: {
    list: ReturnType<typeof vi.fn>;
    search: ReturnType<typeof vi.fn>;
    get: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    service = {
      list: vi.fn(() => of([admin])),
      search: vi.fn(() => of([admin])),
      get: vi.fn(() => of({ ...admin, identificationType: 'CC', residenceAddress: '', dateBirth: '' })),
      remove: vi.fn(() => of(void 0)),
    };
    await TestBed.configureTestingModule({
      imports: [Admins],
      providers: [
        { provide: AdminsService, useValue: service },
        { provide: CitiesService, useValue: { list: () => of([]) } },
        { provide: SchoolsService, useValue: { list: () => of([]) } },
      ],
    }).overrideComponent(Admins, { set: { template: '' } }).compileComponents();

    fixture = TestBed.createComponent(Admins);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('combines names and surnames for lists and searches without modifying edit fields', () => {
    expect(component.admins()[0].fullName).toBe('Maria Elena Perez Gomez');
    expect(component.admins()[0].name).toBe(admin.name);
    expect(component.admins()[0]['lastNames']).toBe(admin.lastName);
    component.onSearch('Perez');
    expect(component.admins()[0].fullName).toBe('Maria Elena Perez Gomez');
  });

  it('handles a missing surname without displaying undefined', () => {
    service.list.mockReturnValue(of([{ ...admin, lastName: undefined }]));
    component.onSearch('');
    expect(component.admins()[0].fullName).toBe('Maria Elena');
  });

  it('shows the full name in the delete confirmation and preserves the person id', () => {
    component.showDelete(component.admins()[0]);
    const dialog = new DeleteRecord();
    dialog.type = 'admins';
    dialog.record = component.adminSelected;
    expect(dialog.displayName).toBe('Maria Elena Perez Gomez');
    component.onConfirmDelete(component.adminSelected);
    expect(service.remove).toHaveBeenCalledWith(admin.id);
    expect(component.showDeleteModal).toBe(false);
    expect(service.list).toHaveBeenCalledTimes(2);
  });

  it('keeps delete failures visible without removing the administrator from the list', () => {
    service.remove.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 403 })));
    component.showDelete(component.admins()[0]);
    component.onConfirmDelete(component.adminSelected);
    expect(component.showDeleteModal).toBe(true);
    expect(component.actionError).toBe('No se pudo eliminar el administrador.');
    expect(component.admins()).toHaveLength(1);
    expect(service.list).toHaveBeenCalledTimes(1);
  });

  it('preserves separate names and surnames when opening the edit form', () => {
    component.showUpdate(component.admins()[0]);
    expect(component.adminSelected['name']).toBe(admin.name);
    expect(component.adminSelected['lastNames']).toBe(admin.lastName);
    expect(component.adminSelected['fullName']).toBe('Maria Elena Perez Gomez');
  });
});
