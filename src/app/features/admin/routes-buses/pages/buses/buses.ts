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
     RecordInformation], 
  templateUrl: './buses.html',
  styleUrl: './buses.css',
})
export class Buses {
  showModal = false;
  busSelected: RecordData = {};

  showDetails(bus: RecordData): void {
    this.busSelected = bus;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.busSelected = {};
  }
}
