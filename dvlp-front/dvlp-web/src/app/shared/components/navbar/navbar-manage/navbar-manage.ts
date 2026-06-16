import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { Input } from '@angular/core';
import { Location } from '@angular/common';


@Component({
  selector: 'app-navbar-manage',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar-manage.html',
  styleUrl: './navbar-manage.css'
})
export class NavbarManage {

  @Input() backRoute: string = '';

  constructor(private router: Router, private location: Location) { }

  goBack() {
    this.location.back();
  }
}