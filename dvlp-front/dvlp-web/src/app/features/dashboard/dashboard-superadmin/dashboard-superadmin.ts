import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarDashboard } from '../../../shared/components/navbar/navbar-dashboard/navbar-dashboard';
import { SidebarSuperadmin } from '../../../shared/components/navbar/sidebar-superadmin/sidebar-superadmin';

@Component({
  selector: 'app-dashboard-superadmin',
  imports: [CommonModule, 
            NavbarDashboard, 
            MatToolbarModule,  
            MatButtonModule, 
            MatIconModule, 
            SidebarSuperadmin,
            RouterModule],
  templateUrl: './dashboard-superadmin.html',
  styleUrl: './dashboard-superadmin.css',
})
export class DashboardSuperadmin {
  
  constructor(private router: Router) {}
  navegarUsuarios() {
    this.router.navigate(['/dashboard-superadmin/administradores']);
  }

  isChildRouteActive(): boolean {  
    return this.router.url !== '/dashboard-superadmin';
  }
}