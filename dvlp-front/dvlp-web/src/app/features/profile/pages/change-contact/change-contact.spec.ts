import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeContact } from './change-contact';

describe('ChangeContact', () => {
  let component: ChangeContact;
  let fixture: ComponentFixture<ChangeContact>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeContact],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeContact);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
