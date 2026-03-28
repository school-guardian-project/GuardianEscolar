import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar-dashboard',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './navbar-dashboard.html',
  styleUrl: './navbar-dashboard.css',
})
export class NavbarDashboard {
  constructor(private router: Router) {}

  goToAdmin() {
    this.router.navigate(['/dashboard/admin']);
  }

  goToSuperAdmin() {
    this.router.navigate(['/dashboard/super-admin']);
  }
}