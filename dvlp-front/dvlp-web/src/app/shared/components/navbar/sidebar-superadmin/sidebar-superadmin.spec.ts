import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarSuperadmin } from './sidebar-superadmin';

describe('SidebarSuperadmin', () => {
  let component: SidebarSuperadmin;
  let fixture: ComponentFixture<SidebarSuperadmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarSuperadmin],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarSuperadmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
