import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationAdmin } from './information-admin';

describe('InformationAdmin', () => {
  let component: InformationAdmin;
  let fixture: ComponentFixture<InformationAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(InformationAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
