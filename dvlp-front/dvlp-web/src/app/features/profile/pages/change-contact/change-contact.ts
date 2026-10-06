import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-change-contact',
  imports: [RouterOutlet, TranslateModule],
  templateUrl: './change-contact.html',
  styleUrl: './change-contact.css',
})
export class ChangeContact {
  private translate = inject(TranslateService);

  ngOnInit() {
    this.loadTranslations();
    this.translate.onLangChange.subscribe(() => {
      this.loadTranslations();
    });
  }

  loadTranslations() {
    // Placeholder to reload localized values if needed.
  }
}
