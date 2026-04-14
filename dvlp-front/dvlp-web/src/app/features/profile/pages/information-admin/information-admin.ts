import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-information-admin',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './information-admin.html',
  styleUrl: './information-admin.css',
})
export class InformationAdmin {
  constructor(private router: Router) {}

  logout() {
    this.router.navigate(['/dashboard-admin']);
  }
}
