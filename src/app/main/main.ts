import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-main',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {}
