import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@angular/cdk/dialog';
import { MobileNavigationService } from '../mobile-navigation/mobile-navigation';
import { LogoutConfirm } from '@shared/components/modal/logout-confirm/logout-confirm';
import { AuthService } from '@core/services/auth.service';


@Component({
  selector: 'app-navbar-manage',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, NgIf, TranslateModule, LogoutConfirm, DialogModule],
  templateUrl: './navbar-manage.html',
  styleUrl: './navbar-manage.scss'
})
export class NavbarManage {

  @Input() backRoute: string = '';

  confirmLogout = false;
  menuOpen = false;
  private readonly navigation = inject(MobileNavigationService);

  constructor(private router: Router, private auth: AuthService) { }

  openMenu(): void {
    if (this.menuOpen) return;
    this.menuOpen = true;
    this.navigation.openRoleMenu().closed.subscribe(() => this.menuOpen = false);
  }

  goBack() {
    this.router.navigateByUrl(this.auth.homeRoute());
  }

  logout() {
    const goLogin = () => this.router.navigateByUrl('/auth/login');
    this.auth.logout().subscribe({ next: goLogin, error: goLogin });
  }
}
