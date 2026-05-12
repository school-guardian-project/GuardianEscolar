import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-nav-component',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './nav-component.html',
  styleUrl: './nav-component.css',
})
export class NavComponent {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
