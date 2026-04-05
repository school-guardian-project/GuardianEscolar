import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar-admin-routes',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './navbar-admin-routes.html',
  styleUrl: './navbar-admin-routes.css',
})
export class NavbarAdminRoutes {
  
navItems = [
  { icon: 'directions_bus', route: '/admin/buses' },
  { icon: 'location_on',  route: '/admin/paradas' },
  { icon: 'route',        route: '/admin/rutas' },

];

  activeRoute = '';

  constructor(private router: Router) {
    // Escucha cambios de ruta para actualizar el botón activo
    this.activeRoute = this.router.url;
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.activeRoute = e.urlAfterRedirects;
      });
  }

  isActive(route: string): boolean {
    return this.activeRoute.includes(route);
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
