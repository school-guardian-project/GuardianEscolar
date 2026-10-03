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
import { BusesService } from '@core/services/buses.service';
import { BusListDto, BusRequestDto, BusResponseDto } from '@core/models/bus.model';

interface BusView extends RecordData {
  id?: string;
  plate: string;
  driver: string;
  brand: string;
  model: string;
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
  };
}

function fromDetail(api: BusResponseDto): BusView {
  return {
    ...fromApi(api),
    capacity: api.capacity != null ? String(api.capacity) : '',
    gps: api.gpsDeviceId ?? '',
    soat: api.soatValidity ?? '',
    status: api.status ?? '',
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
  ],
  templateUrl: './buses.html',
  styleUrl: './buses.scss',
})
export class Buses implements OnInit {
  private busesService = inject(BusesService);

  buses: BusView[] = [];

  showModal = false;
  showUpdateModal = false;
  busSelected: RecordData = {};

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.busesService.list().subscribe({
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
    // ponytail: modal fields don't cover BusRequestDto (campuseId/modelId/status); real toPayload when list data is wired
    this.busesService.update(String(id), updatedRecord as BusRequestDto).subscribe(() => {
      this.closeUpdateModal();
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
}
