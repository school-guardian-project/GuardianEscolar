import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-navbar-dashboard',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar-dashboard.html',
  styleUrl: './navbar-dashboard.css',
})
export class NavbarDashboard {}
