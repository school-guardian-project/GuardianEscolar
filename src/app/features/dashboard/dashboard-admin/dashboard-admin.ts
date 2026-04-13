import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarDashboard } from '../../../shared/components/navbar/navbar-dashboard/navbar-dashboard';
import { Comments } from '../../../shared/components/modal/comments/comments'; // ← agrega

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [
    CommonModule,
    NavbarDashboard,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    Comments, 
  ],
  templateUrl: './dashboard-admin.html',
  styleUrls: ['./dashboard-admin.css'],
})
export class DashboardAdmin {
  showModal = false; 

  constructor(private router: Router) {}

  navegarUsuarios() {
    this.router.navigate(['/dashboard-admin/usuarios']);
  }

  isChildRouteActive(): boolean {  
    return this.router.url !== '/dashboard-admin';
  }
}