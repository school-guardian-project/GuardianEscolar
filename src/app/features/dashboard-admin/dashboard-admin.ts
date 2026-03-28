import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarDashboard } from '../../shared/navbar-dashboard/navbar-dashboard';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true, 
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    NavbarDashboard 
  ],
  templateUrl: './dashboard-admin.html',
  styleUrls: ['./dashboard-admin.css'],
})
export class DashboardAdmin {}