import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

type ThemeColor = 'blue' | 'green' | 'yellow' | 'red';

@Component({
  selector: 'app-themes',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './themes.html',
  styleUrl: './themes.css',
})
export class Themes {
  @Output() close = new EventEmitter<void>();
  currentTheme = localStorage.getItem('theme') ?? 'light-theme-blue';
  readonly colors: ReadonlyArray<{
    name: ThemeColor;
    translationKey: string;
    value: string;
    darkValue: string;
  }> = [
    { name: 'blue', translationKey: 'theme.blue', value: '#1A56DB', darkValue: '#0F2E6B' },
    { name: 'green', translationKey: 'theme.green', value: '#16A34A', darkValue: '#0B4A24' },
    { name: 'yellow', translationKey: 'theme.yellow', value: '#D4A017', darkValue: '#B8860B' },
    { name: 'red', translationKey: 'theme.red', value: '#B42318', darkValue: '#5B1215' },
  ] as const;

  get isDark(): boolean {
    return this.currentTheme.startsWith('dark-theme-');
  }

  get currentColor(): string {
    const match = this.currentTheme.match(/^(?:light|dark)-theme-(blue|green|yellow|red)$/);
    return match?.[1] ?? 'blue';
  }

  setMode(mode: 'light' | 'dark') {
    this.setTheme(`${mode}-theme-${this.currentColor}`);
  }

  setColor(color: ThemeColor) {
    this.setTheme(`${this.isDark ? 'dark' : 'light'}-theme-${color}`);
  }

  previewAccent(mode: 'light' | 'dark'): string {
    const color = this.colors.find(({ name }) => name === this.currentColor);
    return mode === 'dark' ? color?.darkValue ?? '#0F2E6B' : color?.value ?? '#1A56DB';
  }

  setTheme(theme: string) {
    this.currentTheme = theme;

    const previousThemes = Array.from(document.body.classList)
      .filter(className => /^(light|dark)-theme-(blue|green|red|yellow)$/.test(className));
    document.body.classList.remove(...previousThemes);
    document.body.classList.add(theme);

    localStorage.setItem('theme', theme);
  }

  closeModal() {
    this.close.emit();
  }
}
