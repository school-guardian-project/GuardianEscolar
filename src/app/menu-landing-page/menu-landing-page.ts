import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-menu-landing-page',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './menu-landing-page.html',
  styleUrl: './menu-landing-page.css',
})
export class MenuLandingPage {}
