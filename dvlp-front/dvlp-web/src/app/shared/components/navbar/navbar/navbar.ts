import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { DialogModule } from '@angular/cdk/dialog';
import { MobileNavigationService } from '../mobile-navigation/mobile-navigation';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { catchError, of } from 'rxjs';
import { AuthService, ROLES } from '@core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    DialogModule,
    RouterLink,
    TranslateModule,
    CommonModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly navigation = inject(MobileNavigationService);
  menuOpen = false;

  constructor(private router: Router, private auth: AuthService) {}

  openMenu(): void {
    if (this.menuOpen) return;
    this.menuOpen = true;
    this.navigation.open({
      mode: 'public', logged: this.isLogged, dashboard: this.canOpenDashboard,
    }).closed.subscribe(action => {
      this.menuOpen = false;
      switch (action) {
        case 'login': this.login(); break;
        case 'dashboard': this.goToDashboard(); break;
        case 'logout': this.logout(); break;
        case 'contact': this.contact(); break;
        case 'features': this.scrollToSection('funcionalidades'); break;
        case 'how': this.scrollToSection('como-funciona'); break;
      }
    });
  }

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

  scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.router.navigate(['/home'], { fragment: sectionId });
    }
  }

  login() {
    this.router.navigate(['/auth/login']);
  }

  contact() {
    this.router.navigate(['contact']);
  }
}
