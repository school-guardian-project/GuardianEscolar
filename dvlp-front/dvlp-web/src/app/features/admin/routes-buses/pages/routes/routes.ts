import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarManage } from '@shared/components/navbar/navbar-manage/navbar-manage';
import { CardRegister } from '@shared/components/cards/card-register/card-register';
import { CardList } from '@shared/components/cards/card-list/card-list';
import { NavbarAdmin } from '@shared/components/navbar/navbar-admin/navbar-admin';
import { RecordInformation, RecordData } from '@shared/components/modal/record-information/record-information';
import { UpdateRecord } from '@shared/components/modal/update-record/update-record';
import { DeleteRecord } from '@shared/components/modal/delete-record/delete-record';
import { AssignRecord } from '@shared/components/modal/assign-record/assign-record';
import { RoutesService } from '@core/services/routes.service';
import { CampusesService } from '@core/services/campuses.service';
import { AuthService } from '@core/services/auth.service';
import { RouteListDto, RouteRequestDto } from '@core/models/route.model';
import { describeProblem, problemField } from '@core/http/problem-detail';

interface RouteView extends RecordData {
  id?: string;
  name: string;
  destination: string;
  startTime: string;
  endTime: string;
  campuseId?: string;
  campusName?: string;
}

function fromApi(api: RouteListDto): RouteView {
  return {
    id: api.id,
    name: api.name ?? '',
    destination: api.targetSector ?? '',
    startTime: api.startTime ?? '',
    endTime: api.endTime ?? '',
    campuseId: api.campuseId,
  };
}

/** El backend usa TimeOnly: <input type=time> da HH:mm y se completa a HH:mm:ss. */
function toTime(value: unknown): string {
  const time = String(value ?? '').trim();
  return /^\d{2}:\d{2}$/.test(time) ? `:00` : time;
}

function toPayload(form: RecordData): RouteRequestDto {
  return {
    campuseId: String(form['campus'] ?? form['campuseId'] ?? '').trim(),
    name: String(form['name'] ?? '').trim(),
    targetSector: String(form['destination'] ?? '').trim(),
    startTime: toTime(form['startTime']),
    endTime: toTime(form['endTime']),
  };
}

@Component({
  selector: 'app-routes',
  imports: [
    RouterModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    NavbarManage,
    CardRegister,
    CardList,
    NavbarAdmin,
    RecordInformation,
    UpdateRecord,
    DeleteRecord,
    AssignRecord,
  ],
  templateUrl: './routes.html',
  styleUrl: './routes.scss',
})
export class RoutesPage implements OnInit {
  private routesService = inject(RoutesService);
  private campusesService = inject(CampusesService);
  private authService = inject(AuthService);

  @ViewChild(CardRegister) register?: CardRegister;

  routes: RouteView[] = [];

  /**
   * Opciones de los selects de `card-register`/`update-record` (`bus` y
   * `routeSector`). No existe catalogo de sectores en el backend: se derivan de
   * los `targetSector` distintos de las rutas ya registradas.
   */
  fieldOptions: Record<string, string[]> = {};
  fieldOptionLabels: Record<string, Record<string, string>> = {};
  actionError = '';
  saveFieldErrors: Record<string, string> = {};

  showModal = false;
  showUpdateModal = false;
  routeSelected: RecordData = {};

  ngOnInit(): void {
    this.load();
    this.loadCampusOptions();
  }

  private load(): void {
    this.routesService.list().subscribe({
      next: (list) => {
        this.routes = list.map((item) => this.withCampusName(fromApi(item)));
      },
      error: (error: unknown) => {
        this.actionError = describeProblem(error, 'No se pudieron cargar las rutas.');
      },
    });
  }

  private loadCampusOptions(): void {
    const schoolId = this.authService.session.schoolId;
    if (!schoolId) {
      this.actionError = 'No se encontró el colegio asociado a la sesión.';
      return;
    }
    this.campusesService.listBySchool(schoolId).subscribe({
      next: (campuses) => {
        this.fieldOptions = { ...this.fieldOptions, campus: campuses.map((campus) => campus.id) };
        this.fieldOptionLabels = {
          ...this.fieldOptionLabels,
          campus: Object.fromEntries(campuses.map((campus) => [campus.id, campus.name])),
        };
        this.routes = this.routes.map((route) => this.withCampusName(route));
      },
      error: (error: unknown) => {
        this.actionError = describeProblem(error, 'No se pudieron cargar las sedes del colegio.');
      },
    });
  }

  private withCampusName(route: RouteView): RouteView {
    return {
      ...route,
      campusName: this.fieldOptionLabels['campus']?.[route.campuseId ?? ''] ?? '',
    };
  }

  onCreated(form: RecordData): void {
    this.actionError = '';
    this.routesService.create(toPayload(form)).subscribe({
      next: () => {
        this.register?.setValidationMessage('');
        this.register?.resetForm();
        this.load();
      },
      error: (error: unknown) => {
        const message = describeProblem(error, 'No se pudo crear la ruta.');
        const field = problemField(error);
        if (field) this.register?.setFieldError(field, message);
        else this.register?.setValidationMessage(message);
      },
    });
  }

  onSearch(term: string): void {
    const query = term.trim();
    if (!query) {
      this.load();
      return;
    }
    this.routesService.search(query).subscribe({
      next: (list) => (this.routes = list.map((item) => this.withCampusName(fromApi(item)))),
      error: (error: unknown) => {
        this.actionError = describeProblem(error, 'No se pudieron buscar las rutas.');
      },
    });
  }

  showDetails(route: RecordData): void {
    const id = String(route['id'] ?? '');
    if (!id) return;
    this.routesService.get(id).subscribe({
      next: (detail) => {
        this.routeSelected = this.withCampusName({
          ...route,
          campuseId: detail.campuseId,
          campusName: '',
          destination: detail.targetSector,
          name: detail.name,
          startTime: detail.startTime,
          endTime: detail.endTime,
        } as RouteView);
        this.showModal = true;
      },
      error: (error: unknown) => {
        this.actionError = describeProblem(error, 'No se pudo cargar la ruta.');
      },
    });
  }

  showUpdateDetails(route: RecordData): void {
    const id = String(route['id'] ?? '');
    if (!id) return;
    this.routesService.get(id).subscribe({
      next: (detail) => {
        this.routeSelected = {
          id: detail.id,
          name: detail.name,
          campus: detail.campuseId,
          destination: detail.targetSector,
          startTime: detail.startTime,
          endTime: detail.endTime,
        };
        this.showUpdateModal = true;
      },
      error: (error: unknown) => {
        this.actionError = describeProblem(error, 'No se pudo cargar la ruta para actualizarla.');
      },
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.routeSelected = {};
  }

  closeUpdateModal(): void {
    this.actionError = '';
    this.saveFieldErrors = {};
    this.showUpdateModal = false;
    this.routeSelected = {};
  }

  onSaved(updatedRecord: RecordData): void {
    const id = updatedRecord['id'];
    if (!id) {
      this.closeUpdateModal();
      return;
    }
    this.actionError = '';
    this.saveFieldErrors = {};
    this.routesService.update(String(id), toPayload(updatedRecord)).subscribe({
      next: () => {
        this.closeUpdateModal();
        this.load();
      },
      error: (error: unknown) => {
        this.actionError = describeProblem(error, 'No se pudo actualizar la ruta.');
        const field = problemField(error);
        this.saveFieldErrors = field ? { [field]: this.actionError } : {};
      },
    });
  }

  showDeleteModal = false;

  showDelete(route: RecordData): void {
    this.actionError = '';
    this.routeSelected = route;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.actionError = '';
    this.showDeleteModal = false;
    this.routeSelected = {};
  }

  onConfirmDelete(record: RecordData): void {
    const id = record['id'];
    if (!id) {
      this.closeDeleteModal();
      return;
    }
    this.actionError = '';
    this.routesService.remove(String(id)).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.load();
      },
      error: (error: unknown) => {
        this.actionError = describeProblem(error, 'No se pudo eliminar la ruta.');
      },
    });
  }

  showAssignModal = false;

  showAssignDetails(route: RecordData): void {
    this.showModal = false;
    this.routeSelected = route;
    this.showAssignModal = true;
  }

  closeAssignModal(): void {
    this.showAssignModal = false;
    this.routeSelected = {};
  }

  onAssigned(): void {
    this.load();
  }
}
