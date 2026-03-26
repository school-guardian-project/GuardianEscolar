import { Component } from '@angular/core';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';

import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-dashboard-superadmin',
  imports: [Navbar, Footer, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './dashboard-superadmin.html',
  styleUrl: './dashboard-superadmin.css',
})
export class DashboardSuperadmin {}

