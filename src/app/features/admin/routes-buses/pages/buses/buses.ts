import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarManage } from '../../../../../shared/components/navbar/navbar-manage/navbar-manage';
import { CardRegister } from '../../../../../shared/components/cards/card-register/card-register';
import { CardList } from '../../../../../shared/components/cards/card-list/card-list';
import { NavbarAdmin} from '../../../../../shared/components/navbar/navbar-admin/navbar-admin';
import { RecordInformation, RecordData } from '../../../../../shared/components/modal/record-information/record-information';
import { UpdateRecord } from '../../../../../shared/components/modal/update-record/update-record';


@Component({
  selector: 'app-buses',
  imports: [RouterModule, CommonModule,
     MatIconModule, 
     MatButtonModule,     
     MatToolbarModule, 
     NavbarManage, 
     CardRegister, 
     CardList, 
     NavbarAdmin,
     RecordInformation,
     UpdateRecord,
    ], 
  templateUrl: './buses.html',
  styleUrl: './buses.css',
})
export class Buses {
  showModal = false;
  showUpdateModal = false;
  busSelected: RecordData = {};

  showDetails(bus: RecordData): void {
    this.busSelected = bus;
    this.showModal = true;
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
    console.log('[Buses] Datos actualizados:', updatedRecord);
    // this.busesService.update(updatedRecord).subscribe(() => { ... });
    this.closeUpdateModal();
  }
}
