import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarManage } from '../../../../../shared/components/navbar/navbar-manage/navbar-manage';
import { CardRegister } from '../../../../../shared/components/cards/card-register/card-register';
import { CardList } from '../../../../../shared/components/cards/card-list/card-list';
import { NavbarAdmin} from '../../../../../shared/components/navbar/navbar-admin/navbar-admin';

@Component({
  selector: 'app-rutas',
  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    NavbarManage,
    CardRegister,
    CardList,
    NavbarAdmin
  ],
  templateUrl: './rutas.html',
  styleUrl: './rutas.css',
})
export class Rutas {}
