import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarManage } from '../../../../../shared/components/navbar/navbar-manage/navbar-manage';
import { CardRegister } from '../../../../../shared/components/cards/card-register/card-register';
import { CardList } from '../../../../../shared/components/cards/card-list/card-list';
import { NavbarAdminRoutes} from '../../../../../shared/components/navbar/navbar-admin-routes/navbar-admin-routes';


@Component({
  selector: 'app-buses',
  imports: [RouterModule,
     MatIconModule, 
     MatButtonModule, 
     MatToolbarModule, 
     NavbarManage, 
     CardRegister, 
     CardList, 
     NavbarAdminRoutes], 
  templateUrl: './buses.html',
  styleUrl: './buses.css',
})
export class Buses {}
