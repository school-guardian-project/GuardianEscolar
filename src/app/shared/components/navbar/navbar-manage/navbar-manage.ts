import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import {  Input } from '@angular/core';

@Component({
  selector: 'app-navbar-manage',
  standalone: true,
  templateUrl: './navbar-manage.html',
})
export class NavbarManage {

  @Input() backRoute: string = ''; 

  constructor(private router: Router) {}

  goBack() {
    if (this.backRoute) {
      this.router.navigate([this.backRoute]);
    }
  }
}