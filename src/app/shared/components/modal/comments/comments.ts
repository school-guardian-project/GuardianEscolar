import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './comments.html',
  styleUrl: './comments.css',
})
export class Comments {

  @Output() closed = new EventEmitter<void>();

  comentario: string = '';
  enviado: boolean = false;
  mostrandoError: boolean = false;   

  enviar(): void {
    if (this.comentario.trim() === '') {
      this.mostrandoError = true;

      // Oculta el mensaje de error después de 3 segundos
      setTimeout(() => {
        this.mostrandoError = false;
      }, 3000);

      return;
    }

    // Si todo está bien, muestra pantalla de éxito
    this.enviado = true;
    this.mostrandoError = false;
  }

  cerrar(): void {
    this.enviado = false;
    this.comentario = '';
    this.mostrandoError = false;
    this.closed.emit();
  }
}