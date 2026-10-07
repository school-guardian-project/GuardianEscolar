import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { Input } from '@angular/core';
import { Location, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LogoutConfirm } from '@shared/components/modal/logout-confirm/logout-confirm';
import { AuthService } from '@core/services/auth.service';


@Component({
  selector: 'app-navbar-manage',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, NgIf, TranslateModule, LogoutConfirm],
  templateUrl: './navbar-manage.html',
  styleUrl: './navbar-manage.scss'
})
export class NavbarManage {

  @Input() backRoute: string = '';

  confirmLogout = false;

  constructor(private router: Router, private location: Location, private auth: AuthService) { }

  goBack() {
    this.location.back();
  }

  logout() {
    const goLogin = () => this.router.navigateByUrl('/auth/login');
    this.auth.logout().subscribe({ next: goLogin, error: goLogin });
  }
}
