import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  
import { NavbarManage } from '@shared/components/navbar/navbar-manage/navbar-manage';
import { SidebarSuperadmin } from '@shared/components/navbar/sidebar-superadmin/sidebar-superadmin';
import { TranslateModule } from '@ngx-translate/core';
import { SchoolsService } from '@core/services/schools.service';
import { AdminsService } from '../../superadmin/admins/services/admins.service';
import { catchError, finalize, map, of, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard-superadmin',
  imports: [CommonModule, 
            NavbarManage, 
            SidebarSuperadmin,
            RouterModule,
            TranslateModule],
  templateUrl: './dashboard-superadmin.html',
  styleUrl: './dashboard-superadmin.scss',
})
export class DashboardSuperadmin implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  adminsTotal: number | null = null;
  schoolsTotal: number | null = null;
  loadingAdmins = false;
  loadingSchools = false;
  adminsError = false;
  schoolsError = false;

  constructor(
    private readonly router: Router,
    private readonly adminsService: AdminsService,
    private readonly schoolsService: SchoolsService,
  ) {}

  ngOnInit(): void {
    this.loadAdmins();
    this.loadSchools();
  }

  loadAdmins(): void {
    if (this.loadingAdmins) return;
    this.loadingAdmins = true;
    this.adminsError = false;
    this.adminsTotal = null;
    this.adminsService.list().pipe(
      map(admins => admins.length),
      catchError((error: unknown) => {
        console.error('Could not load the administrator count.', error);
        this.adminsError = true;
        return of(null);
      }),
      takeUntil(this.destroy$),
      finalize(() => { this.loadingAdmins = false; }),
    ).subscribe(total => { this.adminsTotal = total; });
  }

  loadSchools(): void {
    if (this.loadingSchools) return;
    this.loadingSchools = true;
    this.schoolsError = false;
    this.schoolsTotal = null;
    this.schoolsService.list().pipe(
      map(schools => schools.length),
      catchError((error: unknown) => {
        console.error('Could not load the school count.', error);
        this.schoolsError = true;
        return of(null);
      }),
      takeUntil(this.destroy$),
      finalize(() => { this.loadingSchools = false; }),
    ).subscribe(total => { this.schoolsTotal = total; });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navegarUsuarios() {
    this.router.navigate(['/dashboard-superadmin/administradores']);
  }

  isChildRouteActive(): boolean {  
    return this.router.url !== '/dashboard-superadmin';
  }
}