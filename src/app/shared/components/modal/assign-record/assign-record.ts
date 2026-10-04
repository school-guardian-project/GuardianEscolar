import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { RecordData } from '@shared/components/modal/record-information/record-information.types';
import { RoutesService } from '@core/services/routes.service';
import { BusesService } from '@core/services/buses.service';
import { DriversService } from '@core/services/drivers.service';

export type AssignType = 'route' | 'student' | 'bus';

const ROUTE_HAS_BUS = 'The route already has a bus assigned';

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

  private stopsRouteId = '';

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
    if (this.type === 'route') return !this.routeHasBus && !!this.selectedBusId;
    if (this.type === 'student') return !!this.selectedRouteId && !!this.selectedStopId;
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
      error: () => {},
    });

    this.busesService.list().subscribe({
      next: (list) => (this.buses = list.map((b) => ({ id: String(b.id), label: b.plate ?? '' }))),
    });
  }

  private loadStudent(): void {
    this.routesService.list().subscribe({
      next: (list) => (this.routes = list.map((r) => ({ id: String(r.id), label: r.name ?? '' }))),
    });

    const profileId = String(this.record['profileId'] ?? '');
    if (!profileId) return;

    this.routesService.getStudentRoute(profileId).subscribe({
      next: (route) => {
        this.selectedRouteId = String(route.id);
        this.stops = (route.stops ?? []).map((s) => ({ id: String(s.id), label: s.name ?? '' }));
        this.stopsRouteId = this.selectedRouteId;

        this.routesService.getStudentStop(this.selectedRouteId, profileId).subscribe({
          next: (stop) => (this.selectedStopId = String(stop.stopId)),
          error: () => {},
        });
      },
      error: () => {},
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
    });
  }

  onRouteChange(routeId: string): void {
    this.selectedStopId = '';
    if (!routeId || routeId === this.stopsRouteId) return;

    this.routesService.get(routeId).subscribe({
      next: (detail) => {
        this.stops = (detail.stops ?? []).map((s) => ({ id: String(s.id), label: s.name ?? '' }));
        this.stopsRouteId = routeId;
      },
      error: () => (this.message = 'assign_record.genericError'),
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

    this.routesService.assignBus(String(this.record['id'] ?? ''), this.selectedBusId).subscribe({
      next: () => this.done(),
      error: (err) => this.fail(err),
    });
  }

  private submitStudent(): void {
    this.routesService
      .assignStudent(this.selectedRouteId, {
        studentId: String(this.record['profileId'] ?? ''),
        stopId: this.selectedStopId,
      })
      .subscribe({
        next: () => this.done(),
        error: (err) => this.fail(err),
      });
  }

  private submitBus(): void {
    this.busesService.assignDriver(String(this.record['id'] ?? ''), this.selectedDriverProfileId).subscribe({
      next: () => this.done(),
      error: (err) => this.fail(err),
    });
  }

  unassign(): void {
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
    const body = (err as { error?: unknown })?.error;
    this.message = typeof body === 'string' && body ? body : 'assign_record.genericError';
  }

  close(): void {
    this.closed.emit();
  }
}
