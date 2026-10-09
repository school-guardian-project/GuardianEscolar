import { Component, HostListener, Injectable, inject } from '@angular/core';
import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService, ROLES } from '@core/services/auth.service';
import { NavbarAdmin } from '../navbar-admin/navbar-admin';
import { SidebarSuperadmin } from '../sidebar-superadmin/sidebar-superadmin';

export type PublicNavigationAction =
  | 'login'
  | 'dashboard'
  | 'logout'
  | 'features'
  | 'how'
  | 'contact';
export interface MobileNavigationData {
  mode: 'admin' | 'superadmin' | 'public';
  logged?: boolean;
  dashboard?: boolean;
}

@Component({
  selector: 'app-mobile-navigation',
  imports: [MatIconModule, TranslateModule, NavbarAdmin, SidebarSuperadmin],
  templateUrl: './mobile-navigation.html',
  styleUrl: './mobile-navigation.css',
})
export class MobileNavigation {
  readonly data = inject<MobileNavigationData>(DIALOG_DATA);
  private readonly dialogRef = inject<DialogRef<PublicNavigationAction>>(DialogRef);

  constructor() {
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => this.close());
  }

  close(action?: PublicNavigationAction): void {
    this.dialogRef.close(action);
  }

  onMenuClick(event: MouseEvent): void {
    if (event.target instanceof Element && event.target.closest('a')) this.close();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 1024) this.close();
  }
}

@Injectable({ providedIn: 'root' })
export class MobileNavigationService {
  private readonly dialog = inject(Dialog);
  private readonly overlay = inject(Overlay);
  private readonly translate = inject(TranslateService);
  private readonly auth = inject(AuthService);

  openRoleMenu(): DialogRef<PublicNavigationAction, MobileNavigation> {
    return this.open({ mode: this.auth.roleId === ROLES.SUPER_ADMIN ? 'superadmin' : 'admin' });
  }

  open(data: MobileNavigationData): DialogRef<PublicNavigationAction, MobileNavigation> {
    return this.dialog.open<PublicNavigationAction, MobileNavigationData, MobileNavigation>(
      MobileNavigation,
      {
        data,
        width: '300px',
        maxWidth: 'calc(100vw - 32px)',
        height: '100dvh',
        positionStrategy: this.overlay.position().global().left('0').top('0'),
        panelClass: 'responsive-navigation-panel',
        ariaLabel: this.translate.instant('responsive.navigation'),
        autoFocus: '.navigation-close',
        restoreFocus: true,
      }
    );
  }
}
