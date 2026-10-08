import { Component, OnInit, inject } from '@angular/core';
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
import { BusesService } from '@core/services/buses.service';
import { RouteListDto, RouteRequestDto } from '@core/models/route.model';

interface RouteView extends RecordData {
  id?: string;
  name: string;
  destination: string;
  startTime: string;
  endTime: string;
}

function fromApi(api: RouteListDto): RouteView {
  return {
    id: api.id,
    name: api.name ?? '',
    destination: api.targetSector ?? '',
    startTime: api.startTime ?? '',
    endTime: api.endTime ?? '',
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
  private busesService = inject(BusesService);

  routes: RouteView[] = [];

  /**
   * Opciones de los selects de `card-register`/`update-record` (`bus` y
   * `routeSector`). No existe catalogo de sectores en el backend: se derivan de
   * los `targetSector` distintos de las rutas ya registradas.
   */
  fieldOptions: Record<string, string[]> = {};

  showModal = false;
  showUpdateModal = false;
  routeSelected: RecordData = {};

  ngOnInit(): void {
    this.load();
    this.loadBusOptions();
  }

  private load(): void {
    this.routesService.list().subscribe({
      next: (list) => {
        this.routes = list.map(fromApi);
        this.fieldOptions = {
          ...this.fieldOptions,
          routeSector: [...new Set(list.map((r) => r.targetSector ?? '').filter(Boolean))],
        };
      },
    });
  }

  private loadBusOptions(): void {
    this.busesService.list().subscribe({
      next: (buses) => {
        this.fieldOptions = {
          ...this.fieldOptions,
          bus: buses.map((b) => b.plate ?? '').filter(Boolean),
        };
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
      next: (list) => (this.routes = list.map(fromApi)),
    });
  }

  showDetails(route: RecordData): void {
    this.routeSelected = route;
    this.showModal = true;
  }

  showUpdateDetails(route: RecordData): void {
    this.routeSelected = route;
    this.showUpdateModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.routeSelected = {};
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.routeSelected = {};
  }

  onSaved(updatedRecord: RecordData): void {
    const id = updatedRecord['id'];
    if (!id) {
      this.closeUpdateModal();
      return;
    }
    // ponytail: modal fields don't cover RouteRequestDto (campuseId/targetSector); real toPayload when list data is wired
    this.routesService.update(String(id), updatedRecord as RouteRequestDto).subscribe(() => {
      this.closeUpdateModal();
    });
  }

  showDeleteModal = false;

  showDelete(route: RecordData): void {
    this.routeSelected = route;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.routeSelected = {};
  }

  onConfirmDelete(record: RecordData): void {
    const id = record['id'];
    if (!id) {
      this.closeDeleteModal();
      return;
    }
    this.routesService.remove(String(id)).subscribe(() => {
      this.closeDeleteModal();
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
