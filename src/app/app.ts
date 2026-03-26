import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuLandingPage } from './menu-landing-page/menu-landing-page';
import { Main } from './main/main';

@Component({
  selector: 'app-root',
  imports: [MenuLandingPage, RouterOutlet, Main],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Guardian Escolar');
}
