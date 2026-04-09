import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:dvlp-front/dvlp-web/src/app/shared/components/crud/crud-layout/crud-layout.spec.ts
import { CrudLayout } from './crud-layout';

describe('CrudLayout', () => {
  let component: CrudLayout;
  let fixture: ComponentFixture<CrudLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(CrudLayout);
========
import { DashboardAdmin } from './dashboard-admin';

describe('DashboardAdmin', () => {
  let component: DashboardAdmin;
  let fixture: ComponentFixture<DashboardAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardAdmin);
>>>>>>>> feature/dashboard-admin:dvlp-front/dvlp-web/src/app/features/dashboard/dashboard-admin/dashboard-admin.spec.ts
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
