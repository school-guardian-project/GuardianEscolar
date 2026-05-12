import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-change-email',
  imports: [RouterOutlet, TranslateModule],
  templateUrl: './change-email.html',
  styleUrl: './change-email.css',
})
export class ChangeEmail {
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
