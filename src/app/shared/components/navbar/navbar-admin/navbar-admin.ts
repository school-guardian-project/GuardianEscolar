import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, CommonModule, RouterModule],
  templateUrl: './navbar-admin.html',
  styleUrl: './navbar-admin.css',
})
export class NavbarAdmin {
  
navItems = [
  { icon: 'person_raised_hand', route: '/admin/usuarios' },
  { icon: 'escalator_warning',  route: '/admin/padres' },
  { icon: 'engineering',        route: '/admin/conductores' },
  { icon: 'family_restroom',    route: '/admin/familias' },
];

  activeRoute = '';

  constructor(private router: Router) {
    // Escucha cambios de ruta para actualizar el botón activo
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