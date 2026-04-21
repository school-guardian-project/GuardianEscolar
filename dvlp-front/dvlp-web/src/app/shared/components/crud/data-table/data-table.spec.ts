import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:dvlp-front/dvlp-web/src/app/shared/components/crud/data-table/data-table.spec.ts
import { DataTable } from './data-table';

describe('DataTable', () => {
  let component: DataTable;
  let fixture: ComponentFixture<DataTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTable],
    }).compileComponents();

    fixture = TestBed.createComponent(DataTable);
========
import { DashboardSuperadmin } from './dashboard-superadmin';

describe('DashboardSuperadmin', () => {
  let component: DashboardSuperadmin;
  let fixture: ComponentFixture<DashboardSuperadmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSuperadmin],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardSuperadmin);
>>>>>>>> feature/dashboard-admin:dvlp-front/dvlp-web/src/app/features/dashboard/dashboard-superadmin/dashboard-superadmin.spec.ts
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
