import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeInformation } from './change-information';

describe('ChangeInformation', () => {
  let component: ChangeInformation;
  let fixture: ComponentFixture<ChangeInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeInformation],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeInformation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
