import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'; // ← agregar
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Guardian Escolar');
  private platformId = inject(PLATFORM_ID);
  private translate = inject(TranslateService); 
  private router = inject(Router);

  setTheme(theme: string) {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.remove(
        'light-theme-blue', 'light-theme-green',
        'dark-theme-blue', 'dark-theme-green'
      );
      document.body.classList.add(theme);
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event) => {
          const url = (event as NavigationEnd).urlAfterRedirects;
          const route = url.split(/[?#]/, 1)[0];
          document.body.classList.toggle(
            'internal-page',
            !['/home', '/contact'].includes(route)
          );
        });

      const savedTheme = localStorage.getItem('theme') || 'light-theme-blue';
      this.setTheme(savedTheme);

 
      const savedLanguage = localStorage.getItem('language') ?? localStorage.getItem('lang') ?? 'es';
      this.translate.setDefaultLang('es');
      this.translate.use(savedLanguage);
    }
  }
}