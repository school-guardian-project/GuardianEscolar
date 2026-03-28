import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverModal } from './popover-modal';

describe('PopoverModal', () => {
  let component: PopoverModal;
  let fixture: ComponentFixture<PopoverModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopoverModal],
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
