import { Component, inject, input } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Location } from '@angular/common';
import { DialogModule } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService, ROLES } from '@core/services/auth.service';
import { MobileNavigationService } from '../mobile-navigation/mobile-navigation';

@Component({
  selector: 'app-nav-component',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, DialogModule, TranslateModule],
  templateUrl: './nav-component.html',
  styleUrl: './nav-component.scss',
})
export class NavComponent {
  constructor(private location: Location) {}
  themed = input<boolean>(false); // false = siempre claro
  private readonly auth = inject(AuthService);
  private readonly navigation = inject(MobileNavigationService);
  menuOpen = false;

  get canOpenMenu(): boolean {
    return this.themed() && this.auth.hasRole(ROLES.ADMIN, ROLES.SUPER_ADMIN);
  }

  openMenu(): void {
    if (!this.canOpenMenu || this.menuOpen) return;
    this.menuOpen = true;
    this.navigation.openRoleMenu().closed.subscribe(() => this.menuOpen = false);
  }

  goBack(): void {
    this.location.back();
  }
}
