import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './features/public/home/home';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'; // ← agregar

@Component({
  selector: 'app-root',
  imports: [Home, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Guardian Escolar');
  private platformId = inject(PLATFORM_ID);
  private translate = inject(TranslateService); 

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
      const savedTheme = localStorage.getItem('theme') || 'light-theme-blue';
      this.setTheme(savedTheme);

      const supportedLangs = ['es', 'en', 'pt', 'fr'];
      const savedLang = localStorage.getItem('lang');
      const selectedLang = savedLang && supportedLangs.includes(savedLang) ? savedLang : 'es';

      this.translate.addLangs(supportedLangs);
      this.translate.setDefaultLang('es');
      this.translate.use(selectedLang).subscribe({
        next: () => {
          localStorage.setItem('lang', selectedLang);
        },
        error: () => {
          this.translate.use('es');
          localStorage.setItem('lang', 'es');
        }
      });
    }
  }
}