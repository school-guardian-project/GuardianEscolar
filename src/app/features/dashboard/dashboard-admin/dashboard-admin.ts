import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NavbarManage } from '@shared/components/navbar/navbar-manage/navbar-manage';
import { Comments } from '@shared/components/modal/comments/comments';
import { UpdateInformation } from '@shared/components/modal/update-information/update-information';
import { SidebarAdmin } from '@shared/components/navbar/sidebar-admin/sidebar-admin';
import {  RecordInformation,  RecordData} from '@shared/components/modal/record-information/record-information';
import { AuthService } from '@core/services/auth.service';
import { SchoolsService } from '@core/services/schools.service';
import { ProfileService } from '@core/services/profile.service';
import { AlertsService, Alert, AlertsResponse } from '@core/services/alerts.service';
import { IncidentsService, Incident, IncidentsResponse } from '@core/services/incidents.service';
import { map, of, switchMap, catchError, debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [
    CommonModule,
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
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
  templateUrl: './dashboard-admin.html',
  styleUrls: ['./dashboard-admin.scss']
})
export class DashboardAdmin implements OnInit {
  private destroy$ = new Subject<void>();

  showComments = false;
  showUpdateInformation = false;
  showInformation = false;

  schoolSelected: RecordData = {};
  schoolIdForUpdate: string | null = null;
  loadingSchool = false;
  schoolErrorKey = '';

  // Alertas
  alertsColumns = ['timestamp', 'studentName', 'routeName', 'alertType', 'message', 'acknowledged', 'actions'];
  alertsData: Alert[] = [];
  alertsTotal = 0;
  alertsPageSize = 5;
  alertsPageIndex = 0;
  alertsSortActive = 'timestamp';
  alertsSortDirection: 'asc' | 'desc' = 'desc';
  alertsLoading = false;

  // Filtros alertas
  alertsAlertTypeFilter = '';
  alertsAcknowledgedFilter = '';
  alertsDateFromFilter: Date | null = null;
  alertsDateToFilter: Date | null = null;
  alertsSearchFilter = '';
  alertsFiltersSubject = new Subject<void>();

  // Incidentes
  incidentsColumns = ['reportedAt', 'routeName', 'driverName', 'busPlate', 'incidentType', 'severity', 'status', 'actions'];
  incidentsData: Incident[] = [];
  incidentsTotal = 0;
  incidentsPageSize = 5;
  incidentsPageIndex = 0;
  incidentsSortActive = 'reportedAt';
  incidentsSortDirection: 'asc' | 'desc' = 'desc';
  incidentsLoading = false;

  // Filtros incidentes
  incidentsTypeFilter = '';
  incidentsSeverityFilter = '';
  incidentsStatusFilter = '';
  incidentsDateFromFilter: Date | null = null;
  incidentsDateToFilter: Date | null = null;
  incidentsSearchFilter = '';
  incidentsFiltersSubject = new Subject<void>();

  constructor(
    private router: Router,
    private readonly authService: AuthService,
    private readonly schoolsService: SchoolsService,
    private readonly profileService: ProfileService,
    private readonly alertsService: AlertsService,
    private readonly incidentsService: IncidentsService,
  ) { }

  ngOnInit(): void {
    this.setupAlertsFilters();
    this.setupIncidentsFilters();
    this.loadAlerts();
    this.loadIncidents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupAlertsFilters(): void {
    this.alertsFiltersSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.alertsPageIndex = 0;
      this.loadAlerts();
    });
  }

  private setupIncidentsFilters(): void {
    this.incidentsFiltersSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.incidentsPageIndex = 0;
      this.loadIncidents();
    });
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

  // ===== ALERTAS =====
  loadAlerts(): void {
    this.alertsLoading = true;
    const filters = {
      page: this.alertsPageIndex,
      size: this.alertsPageSize,
      sort: `${this.alertsSortActive},${this.alertsSortDirection}`,
      alertType: this.alertsAlertTypeFilter || undefined,
      acknowledged: this.alertsAcknowledgedFilter ? this.alertsAcknowledgedFilter === 'true' : undefined,
      dateFrom: this.alertsDateFromFilter ? this.formatDateForApi(this.alertsDateFromFilter) : undefined,
      dateTo: this.alertsDateToFilter ? this.formatDateForApi(this.alertsDateToFilter) : undefined,
      search: this.alertsSearchFilter || undefined,
    };

    this.alertsService.getAlerts(filters).pipe(
      catchError((err: unknown) => {
        console.error('Error loading alerts:', err);
        return of({ content: [], totalElements: 0, totalPages: 0, size: 0, number: 0 } as AlertsResponse);
      })
    ).subscribe({
      next: (res: AlertsResponse) => {
        this.alertsData = res.content || [];
        this.alertsTotal = res.totalElements || 0;
        this.alertsLoading = false;
      },
      error: () => { this.alertsLoading = false; }
    });
  }

  onAlertsPageChange(event: PageEvent): void {
    this.alertsPageIndex = event.pageIndex;
    this.alertsPageSize = event.pageSize;
    this.loadAlerts();
  }

  onAlertsSortChange(sort: Sort): void {
    this.alertsSortActive = sort.active;
    this.alertsSortDirection = sort.direction as 'asc' | 'desc';
    this.loadAlerts();
  }

  onAlertsFilterChange(): void {
    this.alertsFiltersSubject.next();
  }

  acknowledgeAlert(alert: Alert): void {
    this.alertsService.acknowledgeAlert(alert.id).subscribe({
      next: () => {
        alert.acknowledged = true;
        alert.acknowledgedAt = new Date().toISOString();
        alert.acknowledgedBy = this.authService.session.email || 'Admin';
      },
      error: (err) => console.error('Error acknowledging alert:', err)
    });
  }

  getAlertTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      BOARDING: 'Abordaje',
      ALIGHTING: 'Descenso',
      INCIDENT: 'Incidente',
      DELAY: 'Retraso',
      DEVIATION: 'Desviación',
    };
    return labels[type] || type;
  }

  getAlertTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      BOARDING: 'login',
      ALIGHTING: 'logout',
      INCIDENT: 'warning',
      DELAY: 'schedule',
      DEVIATION: 'alt_route',
    };
    return icons[type] || 'notifications';
  }

  // ===== INCIDENTES =====
  loadIncidents(): void {
    this.incidentsLoading = true;
    const filters = {
      page: this.incidentsPageIndex,
      size: this.incidentsPageSize,
      sort: `${this.incidentsSortActive},${this.incidentsSortDirection}`,
      incidentType: this.incidentsTypeFilter || undefined,
      severity: this.incidentsSeverityFilter || undefined,
      status: this.incidentsStatusFilter || undefined,
      dateFrom: this.incidentsDateFromFilter ? this.formatDateForApi(this.incidentsDateFromFilter) : undefined,
      dateTo: this.incidentsDateToFilter ? this.formatDateForApi(this.incidentsDateToFilter) : undefined,
      search: this.incidentsSearchFilter || undefined,
    };

    this.incidentsService.getIncidents(filters).pipe(
      catchError((err: unknown) => {
        console.error('Error loading incidents:', err);
        return of({ content: [], totalElements: 0, totalPages: 0, size: 0, number: 0 } as IncidentsResponse);
      })
    ).subscribe({
      next: (res: IncidentsResponse) => {
        this.incidentsData = res.content || [];
        this.incidentsTotal = res.totalElements || 0;
        this.incidentsLoading = false;
      },
      error: () => { this.incidentsLoading = false; }
    });
  }

  onIncidentsPageChange(event: PageEvent): void {
    this.incidentsPageIndex = event.pageIndex;
    this.incidentsPageSize = event.pageSize;
    this.loadIncidents();
  }

  onIncidentsSortChange(sort: Sort): void {
    this.incidentsSortActive = sort.active;
    this.incidentsSortDirection = sort.direction as 'asc' | 'desc';
    this.loadIncidents();
  }

  onIncidentsFilterChange(): void {
    this.incidentsFiltersSubject.next();
  }

  getIncidentTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      DELAY: 'Retraso',
      BREAKDOWN: 'Falla Mecánica',
      ACCIDENT: 'Accidente',
      DEVIATION: 'Desviación de Ruta',
      OTHER: 'Otro',
    };
    return labels[type] || type;
  }

  getSeverityLabel(severity: string): string {
    const labels: Record<string, string> = {
      LOW: 'Baja',
      MEDIUM: 'Media',
      HIGH: 'Alta',
      CRITICAL: 'Crítica',
    };
    return labels[severity] || severity;
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      OPEN: 'Abierto',
      IN_PROGRESS: 'En Progreso',
      RESOLVED: 'Resuelto',
      CLOSED: 'Cerrado',
    };
    return labels[status] || status;
  }

  private formatDateForApi(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}