import { Component, computed, HostListener, OnInit, PLATFORM_ID, ViewChild, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { catchError, of } from 'rxjs';
import { AuthService, ROLES } from '@core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    TranslateModule,
    CommonModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  constructor(private router: Router, private auth: AuthService) {}

  /**
   * El token solo existe tras un login o un refresh: sin hidratarlo, al recargar
   * la página con la cookie de sesión vigente el menú seguiría mostrando
   * "Iniciar sesión". Es el mismo refresh en single-flight que usa roleGuard.
   */
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId) && !this.auth.isAuthenticated()) {
      this.auth.refresh().pipe(catchError(() => of(null))).subscribe();
    }
  }

  /** Hay sesión activa: el menú deja de ofrecer "Iniciar sesión". */
  get isLogged(): boolean {
    return this.auth.isAuthenticated();
  }

  /** Solo ADMIN y SUPER_ADMIN tienen un dashboard al que llevar; el resto no tiene ruta propia. */
  get canOpenDashboard(): boolean {
    return this.auth.hasRole(ROLES.ADMIN, ROLES.SUPER_ADMIN);
  }

  goToDashboard(): void {
    this.router.navigateByUrl(this.auth.homeRoute());
  }

  logout(): void {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/auth/login']),
      error: () => this.router.navigate(['/auth/login']),
    });
  }

  @ViewChild('sidenav') sidenav!: MatSidenav;

  // Ejecuta este método cada vez que cambie el tamaño de la ventana
  @HostListener('window:resize')
  // Cierra el sidenav si el ancho de la ventana es mayor a 1024px
  onResize() {
    // this.sidenav Valida si el sidenav está abierto y el ancho de la ventana es mayor a 1024px, entonces cierra el sidenav
    if (window.innerWidth > 1024 && this.sidenav?.opened) {
      // Cierra el sidenav si la condicion se cumple
      this.sidenav.close();
    }
  }

  scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  login() {
    this.router.navigate(['/auth/login']);
  }

  contact() {
    this.router.navigate(['contact']);
  }
}
