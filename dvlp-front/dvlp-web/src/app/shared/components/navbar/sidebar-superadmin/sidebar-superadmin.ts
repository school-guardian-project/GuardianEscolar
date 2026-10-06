import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar-superadmin',
  standalone: true,
  imports: [RouterModule, MatIconModule, TranslateModule],
  templateUrl: './sidebar-superadmin.html',
  styleUrls: ['./sidebar-superadmin.scss']
})
export class SidebarSuperadmin {}