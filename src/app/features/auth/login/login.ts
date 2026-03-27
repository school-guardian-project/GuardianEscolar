import { Component } from '@angular/core';
import { Footer } from '../../../shared/footer/footer';
import { NavComponent } from '../../../shared/nav-component/nav-component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [Footer, NavComponent, MatIconModule, MatButtonModule, MatToolbarModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {}
