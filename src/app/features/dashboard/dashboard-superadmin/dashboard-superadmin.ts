import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarManage } from '@shared/components/navbar/navbar-manage/navbar-manage';
import { SidebarSuperadmin } from '@shared/components/navbar/sidebar-superadmin/sidebar-superadmin';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard-superadmin',
  imports: [CommonModule, 
            NavbarManage, 
            MatToolbarModule,  
            MatButtonModule, 
            MatIconModule, 
            SidebarSuperadmin,
            RouterModule,
            TranslateModule],
  templateUrl: './dashboard-superadmin.html',
  styleUrl: './dashboard-superadmin.scss',
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