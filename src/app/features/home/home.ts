import { Component } from '@angular/core';
import { Navbar } from '../../shared/navbar/navbar';
import { Main } from '../../shared/main/main';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-home',
  imports: [Navbar, Main, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
