import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, TranslateModule, CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  private translate = inject(TranslateService);
  private router = inject(Router);
  linksProduct: string[] = [];
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
    this.translate.get('footer.links_legal').subscribe((d: any) => {
      this.linksLegal = Array.isArray(d) ? d : [];
    });

  }

  navigateProduct(index: number) {
    if (index === 0) {
      this.scrollToSection('funcionalidades');
    } else if (index === 1) {
      this.scrollToSection('como-funciona');
    } else if (index === 2) {
      this.router.navigate(['/contact']);
    }
  }

  private scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}