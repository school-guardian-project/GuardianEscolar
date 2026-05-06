import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar-admin',
  standalone: true,
  imports: [RouterModule, MatIconModule, TranslateModule],
  templateUrl: './sidebar-admin.html',
  styleUrls: ['./sidebar-admin.css']
})
export class SidebarAdmin {}