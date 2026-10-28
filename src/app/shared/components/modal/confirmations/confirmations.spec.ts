import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Confirmations } from './confirmations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('Confirmations', () => {
  let component: Confirmations;
  let fixture: ComponentFixture<Confirmations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Confirmations],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { title: 'Confirm', message: 'Continue?' } },
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Confirmations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
