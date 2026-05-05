import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, TranslateModule, CommonModule],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  private translate = inject(TranslateService);
  cards: any[] = [];
  steps: any[] = [];

  ngOnInit() {
    this.loadTranslations();
    this.translate.onLangChange.subscribe(() => {
      this.loadTranslations();
    });
  }

  loadTranslations() {
    this.translate.get('features.cards').subscribe((data: any) => {
      this.cards = Array.isArray(data) ? data : [];
    });
    this.translate.get('how_it_works.steps').subscribe((data: any) => {
      this.steps = Array.isArray(data) ? data : [];
    });
  }
}