import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService, PERMISSIONS } from '@core/services/auth.service';

@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, CommonModule, RouterModule, TranslateModule],
  templateUrl: './navbar-admin.html',
  styleUrl: './navbar-admin.scss',
})
export class NavbarAdmin {
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);

  /** Catálogo de permisos expuesto a la plantilla para gatear los menús (FR-2.1). */
  protected readonly permissions = PERMISSIONS;

  activeRoute = '';

  constructor() {
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
