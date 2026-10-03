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
import { StopsService } from '@core/services/stops.service';
import { StopListDto, StopRequestDto } from '@core/models/stop.model';

interface StopView extends RecordData {
  id?: string;
  name: string;
  address: string;
  latitud: string;
  longitud: string;
}

function fromApi(api: StopListDto): StopView {
  return {
    id: api.id,
    name: api.name ?? '',
    address: api.address ?? '',
    latitud: api.latitude != null ? String(api.latitude) : '',
    longitud: api.longitude != null ? String(api.longitude) : '',
  };
}

@Component({
  selector: 'app-stops',
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
  templateUrl: './stops.html',
  styleUrl: './stops.scss',
})
export class Stops implements OnInit {
  private stopsService = inject(StopsService);

  stops: StopView[] = [];

  showModal = false;
  showUpdateModal = false;
  stopSelected: RecordData = {};

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.stopsService.list().subscribe({
      next: (list) => (this.stops = list.map(fromApi)),
    });
  }

  onSearch(term: string): void {
    const query = term.trim();
    if (!query) {
      this.load();
      return;
    }
    this.stopsService.search(query).subscribe({
      next: (list) => (this.stops = list.map(fromApi)),
    });
  }

  showDetails(stop: RecordData): void {
    this.stopSelected = stop;
    this.showModal = true;
  }

  showUpdateDetails(stop: RecordData): void {
    this.stopSelected = stop;
    this.showUpdateModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.stopSelected = {};
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.stopSelected = {};
  }

  onSaved(updatedRecord: RecordData): void {
    const id = updatedRecord['id'];
    if (!id) {
      this.closeUpdateModal();
      return;
    }
    // ponytail: modal fields don't cover StopRequestDto (cityId/schoolId); real toPayload when list data is wired
    this.stopsService.update(String(id), updatedRecord as StopRequestDto).subscribe(() => {
      this.closeUpdateModal();
    });
  }

  showDeleteModal = false;

  showDelete(stop: RecordData): void {
    this.stopSelected = stop;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.stopSelected = {};
  }

  onConfirmDelete(record: RecordData): void {
    const id = record['id'];
    if (!id) {
      this.closeDeleteModal();
      return;
    }
    this.stopsService.remove(String(id)).subscribe(() => {
      this.closeDeleteModal();
    });
  }
}
