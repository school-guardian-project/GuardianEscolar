import { Component, computed, HostListener, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, 
    // TranslateModule, TranslateService,git
     CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})

export class Navbar {

  constructor(private router: Router) { }

  @ViewChild('sidenav') sidenav!: MatSidenav;

  // Ejecuta este método cada vez que cambie el tamaño de la ventana
  @HostListener('window:resize')
  // Cierra el sidenav si el ancho de la ventana es mayor a 1024px
  onResize() {
    // this.sidenav Valida si el sidenav está abierto y el ancho de la ventana es mayor a 1024px, entonces cierra el sidenav
    if (window.innerWidth > 1024 && this.sidenav?.opened) {
      // Cierra el sidenav si la condicion se cumple
      this.sidenav.close();
    }
  }

  scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  login() {
    this.router.navigate(['/auth/login'])
  }

  contact() {
    this.router.navigate(['contact']);
  }

  // private translate = inject(TranslateService);
  // cards: any[] = [];
  // steps: any[] = [];

  // ngOnInit() {
  //   this.translate.get('features.cards').subscribe((data: any[]) => {
  //     this.cards = data;
  //   });
  //   this.translate.get('how_it_works.steps').subscribe((data: any[]) => {
  //     this.steps = data;
  //   });
  // }
}
