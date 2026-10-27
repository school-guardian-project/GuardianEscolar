import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NavbarManage } from '@shared/components/navbar/navbar-manage/navbar-manage';
import { Comments } from '@shared/components/modal/comments/comments';
import { UpdateInformation } from '@shared/components/modal/update-information/update-information';
import { SidebarAdmin } from '@shared/components/navbar/sidebar-admin/sidebar-admin';
import {  RecordInformation,  RecordData} from '@shared/components/modal/record-information/record-information';
import { AuthService } from '@core/services/auth.service';
import { SchoolsService } from '@core/services/schools.service';
import { ProfileService } from '@core/services/profile.service';
import { StudentsService } from '@core/services/students.service';
import { RoutesService } from '@core/services/routes.service';
import { Alert, AlertType, AlertsService } from '@core/services/alerts.service';
import { map, of, switchMap, catchError, takeUntil, Subject, debounceTime, finalize, forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarManage,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    Comments,
    UpdateInformation,
    SidebarAdmin,
    RecordInformation,
    TranslateModule,
  ],
  templateUrl: './dashboard-admin.html',
  styleUrls: ['./dashboard-admin.scss']
})
export class DashboardAdmin implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private readonly alertRequests$ = new Subject<void>();
  private readonly alertSearch$ = new Subject<void>();

  alerts: Alert[] = [];
  alertTypes: AlertType[] = [];
  alertSearch = '';
  selectedAlertType: number | null = null;
  alertsPage = 0;
  readonly alertsPageSize = 10;
  alertsTotal = 0;
  alertsTotalPages = 0;
  loadingAlerts = false;
  alertsErrorKey = '';
  alertTypesError = false;

  studentsTotal: number | null = null;
  activeRoutesTotal: number | null = null;
  schoolAlertsTotal: number | null = null;
  loadingMetrics = false;
  metricsErrorKey = '';
  studentsError = false;
  routesError = false;
  totalAlertsError = false;

  showComments = false;
  showUpdateInformation = false;
  showInformation = false;

  schoolSelected: RecordData = {};
  schoolIdForUpdate: string | null = null;
  loadingSchool = false;
  schoolErrorKey = '';

  constructor(
    private router: Router,
    private readonly authService: AuthService,
    private readonly schoolsService: SchoolsService,
    private readonly profileService: ProfileService,
    private readonly alertsService: AlertsService,
    private readonly translate: TranslateService,
    private readonly studentsService: StudentsService,
    private readonly routesService: RoutesService,
  ) { }

  ngOnInit(): void {
    this.alertRequests$.pipe(
      switchMap(() => {
        this.loadingAlerts = true;
        this.alertsErrorKey = '';
        this.alerts = [];
        return this.profileService.getProfile().pipe(
          map(profile => this.resolveSchoolId(profile.schoolId)),
          switchMap(schoolId => {
            if (!schoolId) {
              this.alertsErrorKey = 'dashboard.alerts.noSchool';
              return of(null);
            }
            return this.alertsService.getAlerts({
              schoolId,
              page: this.alertsPage,
              size: this.alertsPageSize,
              search: this.alertSearch.trim(),
              alertTypeId: this.selectedAlertType ?? undefined,
            });
          }),
          catchError((error: unknown) => {
            console.error('No se pudieron cargar las alertas del colegio.', error);
            this.alertsErrorKey = 'dashboard.alerts.loadError';
            return of(null);
          }),
          finalize(() => { this.loadingAlerts = false; }),
        );
      }),
      takeUntil(this.destroy$),
    ).subscribe(response => {
      this.alerts = response?.content ?? [];
      this.alertsTotal = response?.totalElements ?? 0;
      this.alertsTotalPages = response?.totalPages ?? 0;
    });
    this.alertSearch$.pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => this.filterAlerts());
    this.loadAlertTypes();
    this.loadAlerts();
    this.loadMetrics();
  }

  loadMetrics(): void {
    if (this.loadingMetrics) return;
    this.loadingMetrics = true;
    this.metricsErrorKey = '';
    this.studentsError = false;
    this.routesError = false;
    this.totalAlertsError = false;
    this.studentsTotal = null;
    this.activeRoutesTotal = null;
    this.schoolAlertsTotal = null;

    this.profileService.getProfile().pipe(
      map(profile => this.resolveSchoolId(profile.schoolId)),
      switchMap(schoolId => {
        if (!schoolId) {
          this.metricsErrorKey = 'dashboard.metrics.noSchool';
          return of(null);
        }
        return forkJoin({
          students: this.metricCount(
            this.studentsService.list().pipe(map(students => students.length)), 'students'),
          routes: this.metricCount(
            // The route API lists only active routes within the administrator's school.
            this.routesService.list().pipe(map(routes => routes.length)),
            'routes'),
          alerts: this.metricCount(
            this.alertsService.getAlerts({ schoolId, page: 0, size: 1 })
              .pipe(map(response => response.totalElements)), 'alerts'),
        });
      }),
      catchError((error: unknown) => {
        console.error('Could not load the school dashboard metrics.', error);
        this.metricsErrorKey = 'dashboard.metrics.loadError';
        return of(null);
      }),
      takeUntil(this.destroy$),
      finalize(() => { this.loadingMetrics = false; }),
    ).subscribe(metrics => {
      this.studentsTotal = metrics?.students ?? null;
      this.activeRoutesTotal = metrics?.routes ?? null;
      this.schoolAlertsTotal = metrics?.alerts ?? null;
    });
  }

  private metricCount(request: Observable<number>, metric: 'students' | 'routes' | 'alerts'): Observable<number | null> {
    return request.pipe(catchError((error: unknown) => {
      console.error(`Could not load the school ${metric} count.`, error);
      if (metric === 'students') this.studentsError = true;
      if (metric === 'routes') this.routesError = true;
      if (metric === 'alerts') this.totalAlertsError = true;
      return of(null);
    }));
  }

  loadAlertTypes(): void {
    this.alertTypesError = false;
    this.alertsService.getAlertTypes().pipe(takeUntil(this.destroy$)).subscribe({
      next: types => { this.alertTypes = types; },
      error: (error: unknown) => {
        console.error('No se pudieron cargar los tipos de alerta.', error);
        this.alertTypesError = true;
      },
    });
  }

  alertTypeLabel(name: string): string {
    if (!name) return this.translate.instant('dashboard.alerts.unknownType');
    const key = `dashboard.alerts.types.${name}`;
    const label = this.translate.instant(key);
    return label === key ? name : label;
  }

  searchAlerts(): void {
    this.alertSearch$.next();
  }

  filterAlerts(): void {
    this.alertsPage = 0;
    this.loadAlerts();
  }

  loadAlerts(): void {
    this.alertRequests$.next();
  }

  changeAlertsPage(page: number): void {
    if (this.loadingAlerts || page < 0 || page >= this.alertsTotalPages) return;
    this.alertsPage = page;
    this.loadAlerts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get schoolId(): string | null {
    return this.authService.session.schoolId;
  }

  navegarUsuarios(): void {
    this.router.navigate(['/dashboard-admin/usuarios']);
  }

  isChildRouteActive(): boolean {
    return this.router.url !== '/dashboard-admin';
  }

  showDetails(): void {
    if (this.loadingSchool) return;
    this.schoolErrorKey = '';
    this.schoolSelected = {};
    this.showInformation = false;
    this.loadingSchool = true;
    this.profileService.getProfile().pipe(
      map((profile) => this.resolveSchoolId(profile.schoolId)),
      switchMap((schoolId) => schoolId ? this.schoolsService.get(schoolId) : of(null)),
    ).subscribe({
      next: (school) => {
        if (!school) {
          this.schoolErrorKey = 'dashboard.schoolInformation.noSchool';
          this.loadingSchool = false;
          return;
        }
        this.schoolSelected = {
          ...school,
          city: school.cityName,
          schooling: school.theme,
        };
        this.loadingSchool = false;
        this.showInformation = true;
      },
      error: (error: unknown) => {
        console.error('No se pudo cargar la escuela asociada al administrador.', error);
        this.loadingSchool = false;
        this.schoolErrorKey = 'dashboard.schoolInformation.loadError';
      },
    });
  }

  openSchoolUpdate(): void {
    if (this.loadingSchool) return;
    this.schoolErrorKey = '';
    this.loadingSchool = true;
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.schoolIdForUpdate = this.resolveSchoolId(profile.schoolId);
        this.loadingSchool = false;
        if (!this.schoolIdForUpdate) {
          this.schoolErrorKey = 'dashboard.schoolInformation.noSchool';
          return;
        }
        this.showUpdateInformation = true;
      },
      error: (error: unknown) => {
        console.error('No se pudo obtener el colegio asociado antes de actualizarlo.', error);
        this.loadingSchool = false;
        this.schoolErrorKey = 'dashboard.schoolInformation.loadError';
      },
    });
  }

  private resolveSchoolId(profileSchoolId: string | null | undefined): string | null {
    const schoolId = profileSchoolId === undefined ? this.authService.session.schoolId : profileSchoolId;
    this.authService.updateSessionSchoolId(schoolId ?? null);
    this.schoolIdForUpdate = schoolId ?? null;
    return this.schoolIdForUpdate;
  }

  closeModal(): void {
    this.showInformation = false;
    this.schoolSelected = {};
  }

  private formatDateForApi(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}