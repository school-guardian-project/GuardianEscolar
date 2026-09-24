import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-language',
  standalone: true,

  imports: [CommonModule, TranslateModule],
  templateUrl: './language.html',
  styleUrls: ['./language.css'],
})
export class Language {
  @Output() close = new EventEmitter<void>();
  @Output() languageChanged = new EventEmitter<string>();

  private translate = inject(TranslateService);

  selectedLanguage = localStorage.getItem('language') ?? localStorage.getItem('lang') ?? 'es';

  languages = [
    { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
    { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹' },
    { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  ];

  selectLanguage(code: string) {
    this.selectedLanguage = code;
  }

  confirm() {
    localStorage.setItem('language', this.selectedLanguage);
    localStorage.removeItem('lang');
    this.translate.use(this.selectedLanguage);
    this.languageChanged.emit(this.selectedLanguage);
    this.close.emit();
  }

  closeModal() {
    this.close.emit();
  }
}