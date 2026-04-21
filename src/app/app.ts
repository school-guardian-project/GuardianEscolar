import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './features/public/home/home';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Weatherforecast } from './weatherforecast';

@Component({
  selector: 'app-root',
   imports: 
   [
    Home, 
    RouterOutlet
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Guardian Escolar');

  weatherForeCastService = inject(Weatherforecast);

  climas: any[] = [];

  constructor() {
    this.weatherForeCastService.obtenerClima().subscribe(data => {
      this.climas = data;
    });
  }
}
