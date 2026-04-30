import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRecord } from './delete-record';

describe('DeleteRecord', () => {
  let component: DeleteRecord;
  let fixture: ComponentFixture<DeleteRecord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteRecord],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteRecord);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
