import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenteredModal } from './centered-modal';

describe('CenteredModal', () => {
  let component: CenteredModal;
  let fixture: ComponentFixture<CenteredModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CenteredModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CenteredModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
