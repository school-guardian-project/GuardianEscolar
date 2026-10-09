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
import { BusListDto, BusRequestDto, BusResponseDto, GpsDeviceDto } from '@core/models/bus.model';
import { CampusesService } from '@core/services/campuses.service';
import { AuthService } from '@core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { SelectOption } from '@shared/components/cards/card-register/card-register';
import { describeProblem, problemField } from '@core/http/problem-detail';

interface BusView extends RecordData {
  id?: string;
  plate: string;
  driver: string;
  brand: string;
  model: string;
  campuseId?: string;
  campusName?: string;
  modelId?: number;
  capacity?: string;
  gps?: string;
  gpsImei?: string;
  gpsStatus?: string;
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

interface DriverOption {
  profileId: string;
  label: string;
}

/** Valor del select de conductor en el modal de edición para "sin conductor". */
const NO_DRIVER = 'none';

/**
 * Payload del POST /fleet/api/buses. `campus` y `model` vienen de selects con
 * `optionsSource`, asi que su valor ya es el id. El GPS sale del select de
 * dispositivos libres o, si se escribe, de un IMEI nuevo que ms-fleet crea.
 */
function toCreatePayload(form: RecordData): BusRequestDto {
  const imei = String(form['gpsImei'] ?? '').trim();
  return {
    campuseId: String(form['campus'] ?? '').trim(),
    soatValidity: String(form['soat'] ?? '').trim(),
    capacity: Number(form['capacity']),
    plate: String(form['matricula'] ?? '').trim(),
    modelId: Number(form['model']),
    gpsDeviceId: imei ? undefined : String(form['gps'] ?? '').trim() || undefined,
    gpsImei: imei || undefined,
    gpsStatus: String(form['gpsStatus']) === 'true',
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
  private campusesService = inject(CampusesService);
  private authService = inject(AuthService);
  private translate = inject(TranslateService);

  @ViewChild(CardRegister) register?: CardRegister;

  buses: BusView[] = [];
  driverOptions: DriverOption[] = [];
  gpsDevices: GpsDeviceDto[] = [];
  campusNames: Record<string, string> = {};
  /** Opciones del formulario de registro (el conductor se elige por nombre). */
  fieldOptions: Record<string, string[]> = {};
  /** GPS libres para el registro: valor = id, etiqueta = IMEI. */
  registerSelectOptions: Record<string, SelectOption[]> = {};
  /** Opciones del modal de edición: valores = ids, etiquetas legibles. */
  updateFieldOptions: Record<string, string[]> = {};
  updateFieldOptionLabels: Record<string, Record<string, string>> = {};
  saveFieldErrors: Record<string, string> = {};

  showModal = false;
  showUpdateModal = false;
  busSelected: RecordData = {};
  actionError = '';

  ngOnInit(): void {
    this.load();
    this.loadDrivers();
    this.loadGpsDevices();
    this.loadCampuses();
  }

  private load(): void {
    this.busesService.list().subscribe({
      next: (list) => {
        this.buses = list.map((bus) => this.withCampus(fromApi(bus)));
      },
      error: (error: unknown) => {
        this.actionError = describeProblem(error, 'No se pudieron cargar los buses.');
      },
    });
  }

  private withCampus(bus: BusView): BusView {
    return { ...bus, campusName: this.campusNames[bus.campuseId ?? ''] ?? '' };
  }

  private loadCampuses(): void {
    const schoolId = this.authService.session.schoolId;
    if (!schoolId) return;
    this.campusesService.listBySchool(schoolId).subscribe({
      next: (campuses) => {
        this.campusNames = Object.fromEntries(campuses.map((c) => [c.id, c.name]));
        this.buses = this.buses.map((bus) => this.withCampus(bus));
      },
      error: () => (this.campusNames = {}),
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
        this.buildUpdateOptions();
      },
      error: (error: unknown) => {
        this.actionError = describeProblem(error, 'No se pudieron cargar los conductores.');
      },
    });
  }

  private loadGpsDevices(): void {
    this.busesService.listGpsDevices().subscribe({
      next: (devices) => {
        this.gpsDevices = devices;
        this.registerSelectOptions = {
          gps: devices.filter((d) => !d.assignedBusId).map((d) => ({ value: d.id, label: d.imei })),
        };
        this.buildUpdateOptions();
      },
      error: () => {
        this.gpsDevices = [];
        this.registerSelectOptions = { gps: [] };
      },
    });
  }

  private driverName(profileId: string | null | undefined): string {
    return this.driverOptions.find((d) => d.profileId === profileId)?.label ?? '';
  }

  /**
   * Opciones del modal de edición. El GPS ofrece los libres más el que ya usa
   * el bus abierto; el conductor ofrece todos más "sin conductor".
   */
  private buildUpdateOptions(currentBusId?: string): void {
    const busId = currentBusId ?? String(this.busSelected['id'] ?? '');
    const gps = this.gpsDevices.filter((d) => !d.assignedBusId || d.assignedBusId === busId);
    this.updateFieldOptions = {
      driver: [NO_DRIVER, ...this.driverOptions.map((d) => d.profileId)],
      gps: gps.map((d) => d.id),
      gpsStatus: ['true', 'false'],
    };
    this.updateFieldOptionLabels = {
      driver: {
        [NO_DRIVER]: this.translate.instant('update_record.bus.noDriver'),
        ...Object.fromEntries(this.driverOptions.map((d) => [d.profileId, d.label])),
      },
      gps: Object.fromEntries(gps.map((d) => [d.id, d.imei])),
      gpsStatus: {
        true: this.translate.instant('register.bus.gpsStatusValues.true'),
        false: this.translate.instant('register.bus.gpsStatusValues.false'),
      },
    };
  }

  /** Detalle legible para el modal de información. */
  private toDetailView(api: BusResponseDto): BusView {
    return {
      ...this.withCampus(fromApi(api)),
      driver: this.driverName(api.driverProfileId) || api.driverName || '',
      modelId: api.modelId,
      capacity: api.capacity != null ? String(api.capacity) : '',
      gps: api.gpsImei ?? '',
      gpsStatus: api.gpsStatus == null ? '' : this.translate.instant(`register.bus.gpsStatusValues.${api.gpsStatus}`),
      soat: (api.soatValidity ?? '').slice(0, 10),
      status: api.status ?? '',
    };
  }

  /** Registro para el modal de edición: los selects trabajan con ids. */
  private toEditView(api: BusResponseDto): BusView {
    return {
      ...fromApi(api),
      driver: api.driverProfileId ?? NO_DRIVER,
      modelId: api.modelId,
      capacity: api.capacity != null ? String(api.capacity) : '',
      gps: api.gpsDeviceId ?? '',
      gpsImei: '',
      gpsStatus: api.gpsStatus == null ? '' : String(api.gpsStatus),
      soat: (api.soatValidity ?? '').slice(0, 10),
      status: api.status ?? '',
      originalDriver: api.driverProfileId ?? NO_DRIVER,
    };
  }

  onCreated(form: RecordData): void {
    this.actionError = '';
    const driverLabel = String(form['driver'] ?? '').trim();
    const payload = toCreatePayload(form);

    this.busesService.create(payload).subscribe({
      next: (busId) => {
        const driver = this.driverOptions.find((d) => d.label === driverLabel);
        this.register?.setValidationMessage('');
        this.register?.resetForm();
        this.loadGpsDevices();

        // El create no acepta conductor: se asigna ahora con PUT /buses/{id}/driver.
        if (driver) {
          this.busesService.assignDriver(String(busId), driver.profileId).subscribe({
            next: () => this.load(),
            error: (error: unknown) => {
              this.actionError = this.translate.instant('errors.bus.driverNotAssigned') + ' ' + describeProblem(error, '');
              this.load();
            },
          });
        } else {
          this.load();
        }
      },
      error: (err) => {
        const message = describeProblem(err, this.translate.instant('errors.bus.create'));
        const field = problemField(err);
        const registerField = field === 'plate' ? 'matricula' : field;
        if (registerField) this.register?.setFieldError(registerField, message);
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
    this.busesService.search(query).subscribe({
      next: (list) => (this.buses = list.map((bus) => this.withCampus(fromApi(bus)))),
      error: (error: unknown) => {
        this.actionError = describeProblem(error, 'No se pudieron buscar los buses.');
      },
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
        this.busSelected = this.toDetailView(detail);
        this.showModal = true;
      },
      error: (error: unknown) => {
        this.actionError = describeProblem(error, 'No se pudo cargar la información del bus.');
      },
    });
  }

  showUpdateDetails(bus: RecordData): void {
    const id = String(bus['id'] ?? '');
    if (!id) return;
    this.actionError = '';
    this.saveFieldErrors = {};
    this.busesService.get(id).subscribe({
      next: (detail) => {
        this.buildUpdateOptions(id);
        this.busSelected = this.toEditView(detail);
        this.showUpdateModal = true;
      },
      error: (error: unknown) => {
        this.actionError = describeProblem(error, 'No se pudo cargar el bus para actualizarlo.');
      },
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.busSelected = {};
  }

  closeUpdateModal(): void {
    this.actionError = '';
    this.saveFieldErrors = {};
    this.showUpdateModal = false;
    this.busSelected = {};
  }

  private failSave(error: unknown, fallbackKey: string): void {
    const message = describeProblem(error, this.translate.instant(fallbackKey));
    const field = problemField(error);
    this.saveFieldErrors = field ? { [field]: message } : {};
    this.actionError = message;
  }

  onSaved(updatedRecord: RecordData): void {
    const id = String(updatedRecord['id'] ?? '');
    if (!id) {
      this.closeUpdateModal();
      return;
    }
    this.actionError = '';
    this.saveFieldErrors = {};
    const imei = String(updatedRecord['gpsImei'] ?? '').trim();
    const payload: BusRequestDto = {
      campuseId: String(updatedRecord['campuseId'] ?? '').trim(),
      soatValidity: String(updatedRecord['soat'] ?? '').trim(),
      capacity: Number(updatedRecord['capacity']),
      plate: String(updatedRecord['plate'] ?? '').trim(),
      modelId: Number(updatedRecord['modelId']),
      gpsDeviceId: imei ? undefined : String(updatedRecord['gps'] ?? '').trim() || undefined,
      gpsImei: imei || undefined,
      gpsStatus: String(updatedRecord['gpsStatus']) === 'true',
    };
    const driver = String(updatedRecord['driver'] ?? NO_DRIVER);
    const originalDriver = String(updatedRecord['originalDriver'] ?? NO_DRIVER);

    this.busesService.update(id, payload).subscribe({
      next: () => {
        const finish = () => {
          this.closeUpdateModal();
          this.load();
          this.loadGpsDevices();
        };
        if (driver === originalDriver) {
          finish();
          return;
        }
        const driverCall = driver === NO_DRIVER
          ? this.busesService.unassignDriver(id)
          : this.busesService.assignDriver(id, driver);
        driverCall.subscribe({
          next: finish,
          error: (error: unknown) => {
            this.load();
            this.loadGpsDevices();
            this.failSave(error, 'errors.bus.driverNotAssigned');
            this.saveFieldErrors = { driver: this.actionError };
          },
        });
      },
      error: (error: unknown) => this.failSave(error, 'errors.bus.update'),
    });
  }
  showDeleteModal = false;

  showDelete(bus: RecordData): void {
    this.actionError = '';
    this.busSelected = bus;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.actionError = '';
    this.showDeleteModal = false;
    this.busSelected = {};
  }

  onConfirmDelete(record: RecordData): void {
    const id = record['id'];
    if (!id) {
      this.closeDeleteModal();
      return;
    }
    this.actionError = '';
    this.busesService.remove(String(id)).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.load();
      },
      error: (error: unknown) => {
        this.actionError = describeProblem(error, 'No se pudo eliminar el bus.');
      },
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
    this.actionError = '';
    this.load();
  }
}
