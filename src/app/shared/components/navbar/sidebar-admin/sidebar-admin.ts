import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { AuthService, PERMISSIONS } from '@core/services/auth.service';

@Component({
  selector: 'app-sidebar-admin',
  standalone: true,
  imports: [RouterModule, MatIconModule, TranslateModule, CommonModule],
  templateUrl: './sidebar-admin.html',
  styleUrls: ['./sidebar-admin.scss']
})
export class SidebarAdmin {
  protected readonly auth = inject(AuthService);

  /** Catálogo de permisos expuesto a la plantilla para gatear los menús (FR-2.1). */
  protected readonly permissions = PERMISSIONS;
}
