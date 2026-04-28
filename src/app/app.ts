import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './features/public/home/home';

import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-root',
   imports: 
   [Home, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Guardian Escolar');

  private platformId = inject(PLATFORM_ID);

setTheme(theme: string) {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.remove(
        'light-theme-blue',
        'light-theme-green',
        'dark-theme-blue',
        'dark-theme-green'
      );

      document.body.classList.add(theme);
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme') || 'light-theme-blue';
      this.setTheme(savedTheme);
    }
  }
}

