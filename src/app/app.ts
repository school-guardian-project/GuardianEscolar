import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { Main } from './shared/main/main';
import { Footer } from './shared/footer/footer';

@Component({
  selector: 'app-root',
  imports: [Navbar, RouterOutlet, Main, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Guardian Escolar');
}
