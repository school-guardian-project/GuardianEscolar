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
import { BusesService } from '@core/services/buses.service';
import { DriversService } from '@core/services/drivers.service';
import { BusListDto, BusRequestDto, BusResponseDto } from '@core/models/bus.model';
import { describeProblem } from '@core/http/problem-detail';

interface BusView extends RecordData {
  id?: string;
  plate: string;
  driver: string;
  brand: string;
  model: string;
  campuseId?: string;
  modelId?: number;
  capacity?: string;
  gps?: string;
  soat?: string;
  status?: string;
}

function fromApi(api: BusListDto): BusView {
  return {
    id: api.id,
    plate: api.plate ?? '',
    driver: api.driverName ?? '',
    brand: api.brand ?? '',
    model: api.model ?? '',
    campuseId: api.campuseId ?? '',
  };
}

function fromDetail(api: BusResponseDto): BusView {
  return {
    ...fromApi(api),
    modelId: api.modelId,
    capacity: api.capacity != null ? String(api.capacity) : '',
    gps: api.gpsDeviceId ?? '',
    soat: api.soatValidity ?? '',
    status: api.status ?? '',
  };
}

interface DriverOption {
  profileId: string;
  label: string;
}

/**
 * Payload del POST /fleet/api/buses. `campus` y `model` vienen de selects con
 * `optionsSource`, asi que su valor ya es el id. `gpsDeviceId` se omite a
 * propósito: ms-fleet lo valida con GpsDeviceExistsAsync contra un proveedor
 * api/gps-devices/{id}/exists que no existe en el codebase (y cuyo HttpClient
 * no tiene BaseAddress), asi que cualquier Guid fallaria igual. El alta quedará
 * bloqueada por el backend hasta que exista ese proveedor.
 */
function toCreatePayload(form: RecordData): BusRequestDto {
  return {
    campuseId: String(form['campus'] ?? '').trim(),
    soatValidity: String(form['soat'] ?? '').trim(),
    capacity: Number(form['capacity']),
    plate: String(form['matricula'] ?? '').trim(),
    modelId: Number(form['model']),
  };
}

@Component({
  selector: 'app-buses',
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
  templateUrl: './buses.html',
  styleUrl: './buses.scss',
})
export class Buses implements OnInit {
  private busesService = inject(BusesService);
  private driversService = inject(DriversService);

  @ViewChild(CardRegister) register?: CardRegister;

  buses: BusView[] = [];
  driverOptions: DriverOption[] = [];
  fieldOptions: Record<string, string[]> = {};

  showModal = false;
  showUpdateModal = false;
  busSelected: RecordData = {};

  ngOnInit(): void {
    this.load();
    this.loadDrivers();
  }

  private load(): void {
    this.busesService.list().subscribe({
      next: (list) => (this.buses = list.map(fromApi)),
    });
  }

  private loadDrivers(): void {
    this.driversService.list().subscribe({
      next: (list) => {
        this.driverOptions = list
          .map((d) => ({
            profileId: d.profileId ?? d.id,
            label: `${d.name ?? ''} ${d.lastName ?? ''}`.trim(),
          }))
          .filter((d) => d.profileId && d.label);
        this.fieldOptions = { driver: this.driverOptions.map((d) => d.label) };
      },
    });
  }

  onCreated(form: RecordData): void {
    const driverLabel = String(form['driver'] ?? '').trim();
    const payload = toCreatePayload(form);

    this.busesService.create(payload).subscribe({
      next: (busId) => {
        const driver = this.driverOptions.find((d) => d.label === driverLabel);
        this.register?.setValidationMessage('');
        this.register?.resetForm();

        // El create no acepta conductor: se asigna ahora con PUT /buses/{id}/driver.
        if (driver) {
          this.busesService.assignDriver(String(busId), driver.profileId).subscribe({
            next: () => this.load(),
            // Si la asignación falla el bus existe igual; se reintenta desde el modal.
            error: () => this.load(),
          });
        } else {
          this.load();
        }
      },
      error: (err) => {
        this.register?.setValidationMessage(
          describeProblem(err, 'No se pudo registrar el bus. Verifica que el backend esté disponible.')
        );
      },
    });
  }

  onSearch(term: string): void {
    const query = term.trim();
    if (!query) {
      this.load();
      return;
    }
    this.busesService.search(query).subscribe({
      next: (list) => (this.buses = list.map(fromApi)),
    });
  }

  showDetails(bus: RecordData): void {
    const id = bus['id'];
    if (!id) {
      this.busSelected = bus;
      this.showModal = true;
      return;
    }
    this.busesService.get(String(id)).subscribe({
      next: (detail) => {
        this.busSelected = fromDetail(detail);
        this.showModal = true;
      },
    });
  }

  showUpdateDetails(bus: RecordData): void {
    this.busSelected = bus;
    this.showUpdateModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.busSelected = {};
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.busSelected = {};
  }

  onSaved(updatedRecord: RecordData): void {
    const id = updatedRecord['id'];
    if (!id) {
      this.closeUpdateModal();
      return;
    }
    // El modal de edición no captura sede ni el id de modelo, pero el PUT los
    // exige y los reescribe: se conservan los del bus en la lista para no
    // vaciar la sede (Guid.Empty) ni mandar el nombre del modelo como id (NaN).
    const current = this.buses.find((b) => b.id === id);
    const modelId = Number(updatedRecord['modelId']);
    const safeModelId = Number.isFinite(modelId) && modelId > 0 ? modelId : (current?.modelId ?? 0);
    const payload: BusRequestDto = {
      campuseId: String(updatedRecord['campuseId'] ?? current?.campuseId ?? '').trim(),
      soatValidity: String(updatedRecord['soat'] ?? updatedRecord['soatValidity'] ?? '').trim(),
      capacity: Number(updatedRecord['capacity']),
      plate: String(updatedRecord['plate'] ?? current?.plate ?? '').trim(),
      modelId: safeModelId,
    };
    this.busesService.update(String(id), payload).subscribe({
      next: () => {
        this.closeUpdateModal();
        this.load();
      },
      error: () => undefined,
    });
  }

  showDeleteModal = false;

  showDelete(bus: RecordData): void {
    this.busSelected = bus;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.busSelected = {};
  }

  onConfirmDelete(record: RecordData): void {
    const id = record['id'];
    if (!id) {
      this.closeDeleteModal();
      return;
    }
    this.busesService.remove(String(id)).subscribe(() => {
      this.closeDeleteModal();
    });
  }

  showAssignModal = false;

  showAssignDetails(bus: RecordData): void {
    this.showModal = false;
    this.busSelected = bus;
    this.showAssignModal = true;
  }

  closeAssignModal(): void {
    this.showAssignModal = false;
    this.busSelected = {};
  }

  onAssigned(): void {
    this.load();
  }
}
