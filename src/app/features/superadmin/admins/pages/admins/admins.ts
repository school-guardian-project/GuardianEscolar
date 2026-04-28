import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarManage } from '../../../../../shared/components/navbar/navbar-manage/navbar-manage';
import { CardRegister } from '../../../../../shared/components/cards/card-register/card-register';
import { CardList } from '../../../../../shared/components/cards/card-list/card-list';
import { SidebarSuperadmin } from '../../../../../shared/components/navbar/sidebar-superadmin/sidebar-superadmin';

@Component({
  selector: 'app-admins',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    NavbarManage,
    CardRegister,
    CardList,
    SidebarSuperadmin,
  ],
  templateUrl: './admins.html',
  styleUrl: './admins.css',
})
export class Admins {}
