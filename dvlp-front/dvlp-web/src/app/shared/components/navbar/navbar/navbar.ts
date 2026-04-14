// Importaciones del paquete principal de Angular Core
import { Component, DOCUMENT, effect, inject, PLATFORM_ID, signal } from '@angular/core';

// Módulos de Angular Material para componentes de UI
// MatToolbarModule: Barra de herramientas superior
// MatButtonModule: Botones estilizados
// MatIconModule: Iconos (requiere instalar @angular/material/icon)
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

// RouterLink: Directiva de Angular Router para navegación SPA (Single Page Application)
// Permite vincular a otras rutas sin recargar la página
import { RouterLink } from '@angular/router';

// isPlatformBrowser: Función que verifica si el código se ejecuta en el navegador
// Importante para SSR (Server-Side Rendering) donde window/localStorage no existen
import { isPlatformBrowser, NgClass } from '@angular/common';

@Component({
  selector: 'app-navbar',

  // imports: Módulos y directivas que este componente necesita
  // Angular Material requiere importar sus módulos para usar sus componentes
  imports: [
    MatToolbarModule, // Barra de herramientas (mat-toolbar)
    MatButtonModule, // Botones (mat-button, mat-icon-button)
    MatIconModule, // Iconos (mat-icon)
    RouterLink,
    NgClass
],

  // templateUrl: Ruta al archivo HTML del template del componente
  templateUrl: './navbar.html',

  // styleUrl: Ruta al archivo CSS específico del componente
  styleUrl: './navbar.css',
})

export class Navbar {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
