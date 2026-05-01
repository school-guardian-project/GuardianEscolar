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
    this.translate.get('footer.links_product').subscribe((d: string[]) => this.linksProduct = d);
    this.translate.get('footer.links_company').subscribe((d: string[]) => this.linksCompany = d);
    this.translate.get('footer.links_legal').subscribe((d: string[]) => this.linksLegal = d);
  }
}