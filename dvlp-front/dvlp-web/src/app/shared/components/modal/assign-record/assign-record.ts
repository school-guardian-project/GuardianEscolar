import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { RecordData } from '@shared/components/modal/record-information/record-information.types';
import { RoutesService } from '@core/services/routes.service';
import { BusesService } from '@core/services/buses.service';
import { DriversService } from '@core/services/drivers.service';
import { HttpErrorResponse } from '@angular/common/http';
import { describeProblem } from '@core/http/problem-detail';

export type AssignType = 'route' | 'student' | 'bus';

const ROUTE_HAS_BUS = 'assign_record.route.alreadyAssigned';

interface SelectOption {
  id: string;
  label: string;
}

@Component({
  selector: 'app-assign-record',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, TranslateModule],
  templateUrl: './assign-record.html',
  styleUrl: './assign-record.css',
})
export class AssignRecord implements OnInit {
  @Input() type: AssignType = 'route';
  @Input() record: RecordData = {};

  @Output() assigned = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  private routesService = inject(RoutesService);
  private busesService = inject(BusesService);
  private driversService = inject(DriversService);

  buses: SelectOption[] = [];
  routes: SelectOption[] = [];
  stops: SelectOption[] = [];
  drivers: SelectOption[] = [];

  selectedBusId = '';
  selectedRouteId = '';
  selectedStopId = '';
  selectedDriverProfileId = '';

  routeHasBus = false;
  currentDriver = '';
  message = '';
  submitting = false;

  private stopsRouteId = '';

  private get studentProfileId(): string {
    const value = this.record['profileId'];
    return typeof value === 'string'
      && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
      && value !== '00000000-0000-0000-0000-000000000000'
      ? value : '';
  }

  get titleKey(): string {
    return `assign_record.${this.type}.title`;
  }

  get icon(): string {
    if (this.type === 'route') return 'directions_bus';
    if (this.type === 'student') return 'person';
    return 'engineering';
  }

  get displayName(): string {
    return String(this.record['name'] ?? this.record['plate'] ?? '');
  }

  get canSubmit(): boolean {
    if (this.submitting) return false;
    if (this.type === 'route') return !this.routeHasBus && !!this.selectedBusId;
    if (this.type === 'student') return !!this.studentProfileId
      && this.selectedRouteId === this.stopsRouteId
      && this.stops.some(stop => stop.id === this.selectedStopId);
    return !this.currentDriver && !!this.selectedDriverProfileId;
  }

  ngOnInit(): void {
    if (this.type === 'route') this.loadRoute();
    else if (this.type === 'student') this.loadStudent();
    else this.loadBus();
  }

  private loadRoute(): void {
    this.routesService.get(String(this.record['id'] ?? '')).subscribe({
      next: (detail) => {
        this.routeHasBus = !!detail.busId;
        if (this.routeHasBus) this.message = ROUTE_HAS_BUS;
      },
      error: () => (this.message = 'assign_record.genericError'),
    });

    this.busesService.list().subscribe({
      next: (list) => (this.buses = list.map((b) => ({ id: String(b.id), label: b.plate ?? '' }))),
      error: () => (this.message = 'assign_record.genericError'),
    });
  }

  private loadStudent(): void {
    const profileId = this.studentProfileId;
    if (!profileId) {
      this.message = 'assign_record.student.missingProfile';
      return;
    }

    this.routesService.list().subscribe({
      next: (list) => (this.routes = list.map((r) => ({ id: String(r.id), label: r.name ?? '' }))),
      error: () => (this.message = 'assign_record.genericError'),
    });

    this.routesService.getStudentRoute(profileId).subscribe({
      next: (route) => {
        if (this.selectedRouteId) return;
        this.selectedRouteId = String(route.id);
        this.stops = (route.stops ?? []).map((s) => ({ id: String(s.id), label: s.name || s.address }));
        this.stopsRouteId = this.selectedRouteId;

        this.routesService.getStudentStop(this.selectedRouteId, profileId).subscribe({
          next: (stop) => {
            if (this.selectedRouteId === route.id) this.selectedStopId = String(stop.stopId);
          },
          error: (error: unknown) => {
            if (!(error instanceof HttpErrorResponse) || error.status !== 404) {
              this.message = describeProblem(error, 'assign_record.genericError');
            }
          },
        });
      },
      error: (error: unknown) => {
        if (!(error instanceof HttpErrorResponse) || error.status !== 404) {
          this.message = describeProblem(error, 'assign_record.genericError');
        }
      },
    });
  }

  private loadBus(): void {
    this.currentDriver = String(this.record['driver'] ?? '');

    this.driversService.list().subscribe({
      next: (list) =>
        (this.drivers = list
          .filter((d) => d.profileId)
          .map((d) => ({
            id: String(d.profileId),
            label: `${d.name ?? ''} ${d.lastName ?? ''}`.trim(),
          }))),
      error: () => (this.message = 'assign_record.genericError'),
    });
  }

  onRouteChange(routeId: string): void {
    this.selectedRouteId = routeId;
    this.selectedStopId = '';
    if (routeId && routeId === this.stopsRouteId) return;
    this.stops = [];
    this.stopsRouteId = '';
    if (!routeId) return;

    this.routesService.get(routeId).subscribe({
      next: (detail) => {
        if (this.selectedRouteId !== routeId) return;
        this.stops = (detail.stops ?? []).map((s) => ({ id: String(s.id), label: s.name || s.address }));
        this.stopsRouteId = routeId;
      },
      error: (error: unknown) => {
        if (this.selectedRouteId === routeId) this.message = describeProblem(error, 'assign_record.genericError');
      },
    });
  }

  submit(): void {
    if (this.type === 'route') this.submitRoute();
    else if (this.type === 'student') this.submitStudent();
    else this.submitBus();
  }

  private submitRoute(): void {
    if (this.routeHasBus) {
      this.message = ROUTE_HAS_BUS;
      return;
    }

    this.submitting = true;
    this.routesService.assignBus(String(this.record['id'] ?? ''), this.selectedBusId).subscribe({
      next: () => this.done(),
      error: (err) => this.fail(err),
    });
  }

  private submitStudent(): void {
    const profileId = this.studentProfileId;
    if (!profileId) {
      this.message = 'assign_record.student.missingProfile';
      return;
    }
    if (!this.canSubmit) return;

    this.submitting = true;
    const routeId = this.selectedRouteId;
    const stopId = this.selectedStopId;
    this.routesService
      .assignStudent(routeId, {
        studentId: profileId,
        stopId,
      })
      .subscribe({
        next: () => this.routesService.getStudentStop(routeId, profileId).subscribe({
          next: (saved) => {
            if (saved.studentProfileId?.toLowerCase() === profileId.toLowerCase()
              && saved.routeId?.toLowerCase() === routeId.toLowerCase()
              && saved.stopId?.toLowerCase() === stopId.toLowerCase()) {
              this.done();
            } else {
              this.message = 'assign_record.student.assignmentNotVerified';
              this.submitting = false;
            }
          },
          error: () => {
            this.message = 'assign_record.student.assignmentNotVerified';
            this.submitting = false;
          },
        }),
        error: (err) => this.fail(err),
      });
  }

  private submitBus(): void {
    this.submitting = true;
    this.busesService.assignDriver(String(this.record['id'] ?? ''), this.selectedDriverProfileId).subscribe({
      next: () => this.done(),
      error: (err) => this.fail(err),
    });
  }

  unassign(): void {
    this.submitting = true;
    this.busesService.unassignDriver(String(this.record['id'] ?? '')).subscribe({
      next: () => this.done(),
      error: (err) => this.fail(err),
    });
  }

  private done(): void {
    this.assigned.emit();
    this.closed.emit();
  }

  private fail(err: unknown): void {
    this.message = describeProblem(err, 'assign_record.genericError');
    this.submitting = false;
  }

  close(): void {
    this.closed.emit();
  }
}
