import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, TranslateModule, CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  private translate = inject(TranslateService);
  linksProduct: string[] = [];
  linksCompany: string[] = [];
  linksLegal: string[] = [];

  ngOnInit() {

    this.loadTranslations();
    this.translate.onLangChange.subscribe(() => {
      this.loadTranslations();
    });
  }

  loadTranslations() {
    this.translate.get('footer.links_product').subscribe((d: any) => {
      this.linksProduct = Array.isArray(d) ? d : [];
    });
    this.translate.get('footer.links_company').subscribe((d: any) => {
      this.linksCompany = Array.isArray(d) ? d : [];
    });
    this.translate.get('footer.links_legal').subscribe((d: any) => {
      this.linksLegal = Array.isArray(d) ? d : [];
    });

  }
}