import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './language.html',
  styleUrls: ['./language.css'],
})
export class Language {

  @Output() close = new EventEmitter<void>();
  @Output() languageChanged = new EventEmitter<string>();

  selectedLang = localStorage.getItem('lang') ?? 'es';

  language = [
    { code: 'es', name: 'Español', native: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', native: 'Ingles', flag: '🇺🇸' },
    { code: 'pt', name: 'português ', native: 'Portugués ', flag: '🇵🇹' },
    { code: 'fr', name: 'Français', native: 'Francés', flag: '🇫🇷' },
  ];

  selectLang(code: string) {
    this.selectedLang = code;
  }

  confirm() {
    localStorage.setItem('lang', this.selectedLang);
    this.languageChanged.emit(this.selectedLang);
    this.close.emit();
  }

  closeModal() {
    this.close.emit();
  }

}
