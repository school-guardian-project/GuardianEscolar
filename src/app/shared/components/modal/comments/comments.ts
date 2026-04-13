import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comments.html',
  styleUrl: './comments.css',
})
export class Comments {
  @Output() closed = new EventEmitter<void>();

  comentario: string = '';
  enviado = false;

  cerrar(): void {
    this.enviado = false;   // ← resetea
    this.comentario = '';   // ← limpia el texto
    this.closed.emit();
  }

  enviar(): void {
    if (this.comentario.trim()) {
      this.enviado = true;
    }
  }
}