import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Aviso de error de pagina (carga, busqueda o accion fallida). Antes estos
 * mensajes eran un <p> dentro del contenedor flex de las paginas y quedaban al
 * lado de las cards, deformando el layout. Como modal no ocupa espacio en la
 * pagina: las cards se pintan igual, vacias si la carga fallo.
 */
@Component({
  selector: 'app-error-alert',
  standalone: true,
  imports: [MatIconModule, TranslateModule],
  templateUrl: './error-alert.html',
  styleUrl: './error-alert.css',
})
export class ErrorAlert {
  @Input() message = '';

  /** Cerrar y Aceptar solo descartan el aviso, por eso emiten el mismo evento. */
  @Output() closed = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  close(): void {
    this.closed.emit();
  }
}
