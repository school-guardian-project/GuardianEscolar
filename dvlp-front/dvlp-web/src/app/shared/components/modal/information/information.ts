import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule], 
  templateUrl: './information.html',
  styleUrl: './information.css',
})

export class Information {

  comentario: string = '';
  enviado: boolean = false;
  mostrandoError: boolean = false;

  @Output() closed = new EventEmitter<void>();

  enviar(): void {
    if (this.comentario.trim() === '') {
      this.mostrandoError = true;
      
      // Oculta el mensaje de error después de 3 segundos
      setTimeout(() => {
        this.mostrandoError = false;
      }, 3000);
      
      return;
    }

    // Si todo está bien → mostramos pantalla de éxito
    this.enviado = true;
    this.mostrandoError = false;
  }

  cerrar(): void {
    this.enviado = false;
    this.comentario = '';
    this.mostrandoError = false;
    this.closed.emit();        // Cierra el modal desde el padre
  }
}
