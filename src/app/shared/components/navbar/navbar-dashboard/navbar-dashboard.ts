import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-dashboard',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './navbar-dashboard.html',
  styleUrl: './navbar-dashboard.css',
})
export class NavbarDashboard {
  constructor(private router: Router) {}

logout() {
  //alternativa para evitar que el usuario vuelva a la página del dashboard después de cerrar sesión
  //volver al inicio
  this.router.navigateByUrl('/', { replaceUrl: true });
}
goToAdmin() {
  this.router.navigate(['/dashboard-admin']);
}

goToSuperAdmin() {
  this.router.navigate(['/dashboard-superadmin']);
}
}