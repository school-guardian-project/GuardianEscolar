import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarManage } from '../../../../../shared/components/navbar/navbar-manage/navbar-manage';
import { CardRegister } from '../../../../../shared/components/cards/card-register/card-register';
import { NavbarAdmin } from '../../../../../shared/components/navbar/navbar-admin/navbar-admin';
import { CardList } from '../../../../../shared/components/cards/card-list/card-list';

@Component({
  selector: 'app-familia',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    NavbarManage,
    CardRegister,
    CardList,
    NavbarAdmin,
  ],
  templateUrl: './familia.html',
  styleUrl: './familia.css',
})
export class Familia {}
