import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Navbar } from "../../shared/navbar/navbar";

@Component({
  selector: 'app-dashboard-superadmin',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, Navbar],
  templateUrl: './dashboard-superadmin.html',
  styleUrl: './dashboard-superadmin.css',
})
export class DashboardSuperadmin {}
