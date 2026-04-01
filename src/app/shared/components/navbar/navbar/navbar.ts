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
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',

  // imports: Módulos y directivas que este componente necesita
  // Angular Material requiere importar sus módulos para usar sus componentes
  imports: [
    MatToolbarModule, // Barra de herramientas (mat-toolbar)
    MatButtonModule, // Botones (mat-button, mat-icon-button)
    MatIconModule, // Iconos (mat-icon)
    RouterLink, // Directiva para enlaces de navegación
  ],

  // templateUrl: Ruta al archivo HTML del template del componente
  templateUrl: './navbar.html',

  // styleUrl: Ruta al archivo CSS específico del componente
  styleUrl: './navbar.css',
})

export class Navbar {
  // Inyección de dependencias usando inject()
  // Document: Proporciona acceso al objeto document del DOM
  // Se inyecta de forma privada ya que solo se usa internamente
  private document = inject(DOCUMENT);

  // PLATFORM_ID: Token que identifica la plataforma actual (browser o server)
  // Necesario para verificar el entorno antes de acceder a APIs del navegador
  private platformId = inject(PLATFORM_ID);

  // SIGNAL: Sistema de estado reactivo de Angular (introducido en Angular 16+)
  // signal(false): Crea una señal con valor inicial false (modo claro por defecto)
  // Las signals detectan cambios automáticamente y actualizan la UI
  isDarkMode = signal(false);

  constructor() {
    // Verifica si el código se ejecuta en el navegador
    // isPlatformBrowser retorna true si estamos en el cliente, false si en servidor
    // Esto previene errores en SSR (Server-Side Rendering)
    const isBrowser = isPlatformBrowser(this.platformId);

    // Solo accede a localStorage si estamos en el navegador
    if (isBrowser) {
      // localStorage: Almacenamiento persistente en el navegador
      // getItem: Recupera el valor asociado a la key 'darkMode'
      // Retorna null si no existe ningún valor guardado
      const saved = localStorage.getItem('darkMode');

      // Verifica si existe una preferencia guardada
      if (saved !== null) {
        // saved === 'true': Compara con string 'true' porque localStorage solo guarda strings
        // this.isDarkMode.set(): Asigna un nuevo valor a la signal
        this.isDarkMode.set(saved === 'true');
      } else {
        // Si no hay preferencia guardada, usa la configuración del sistema operativo
        // window.matchMedia: API del navegador para consultar media queries CSS
        // '(prefers-color-scheme: dark)': Media query estándar de CSS
        // .matches: Retorna true si el sistema prefiere tema oscuro
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.isDarkMode.set(prefersDark);
      }
    }

    // effect(): Función que se ejecuta automáticamente cuando las signals cambian
    // Se re-ejecuta cada vez que this.isDarkMode() cambia de valor
    // Es parte del sistema de signals de Angular para manejar side effects
    effect(() => {
      // Lee el valor actual de la señal (los paréntesis son obligatorios)
      const dark = this.isDarkMode();

      // Solo manipula el DOM si estamos en el navegador
      if (isBrowser) {
        // body.classList: API del DOM para manipular clases del elemento body
        // .toggle('dark-theme', dark):
        //   - Agrega la clase 'dark-theme' si dark es true
        //   - Remueve la clase 'dark-theme' si dark es false
        this.document.body.classList.toggle('dark-theme', dark);

        // localStorage.setItem: Guarda un valor con una key específica
        // String(dark): Convierte el booleano a string ('true' o 'false')
        // porque localStorage solo acepta strings como valores
        localStorage.setItem('darkMode', String(dark));
      }
    });
  }

  // toggleDarkMode(): Método público para alternar entre modo claro y oscuro
  // Será llamado desde el template mediante event binding (click)
  toggleDarkMode() {
    // isDarkMode.update(): Método de signals que recibe el valor actual
    // y retorna el nuevo valor
    // v => !v: Función flecha que niega el valor actual
    // Si es true → false, si es false → true
    this.isDarkMode.update((v) => !v);
  }
}
