import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-manage',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar-manage.html',
  styleUrl: './navbar-manage.css'
})
export class NavbarManage {

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/dashboard-admin']);
  }
}