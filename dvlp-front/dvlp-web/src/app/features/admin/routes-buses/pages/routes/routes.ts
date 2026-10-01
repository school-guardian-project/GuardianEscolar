import { Component, inject } from '@angular/core';
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
import { RoutesService } from '@core/services/routes.service';
import { RouteRequestDto } from '@core/models/route.model';

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
  ],
  templateUrl: './routes.html',
  styleUrl: './routes.scss',
})
export class RoutesPage {
  private routesService = inject(RoutesService);

  showModal = false;
  showUpdateModal = false;
  routeSelected: RecordData = {};

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
}
