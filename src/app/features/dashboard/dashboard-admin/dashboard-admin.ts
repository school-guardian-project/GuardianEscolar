import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarDashboard } from '../../../shared/components/navbar/navbar-dashboard/navbar-dashboard';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [
    NavbarDashboard,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './dashboard-admin.html',
  styleUrls: ['./dashboard-admin.css'],
})
export class DashboardAdmin {}