import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-update-information',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './update-information.html',
  styleUrl: './update-information.css',
})
export class UpdateInformation {
  @Output() closed = new EventEmitter<void>();

  nombreEscuela: string = '';
  ciudad: string = '';
  direccion: string = '';
  telefono: string = '';
  email: string = '';
  website: string = '';
  enviado: boolean = false;
  mostrandoError: boolean = false;

  actualizar(): void {
    const alguno =
      this.nombreEscuela.trim() ||
      this.ciudad.trim() ||
      this.direccion.trim() ||
      this.telefono.trim() ||
      this.email.trim() ||
      this.website.trim();

    if (!alguno) {
      this.mostrandoError = true;
      return;
    }

    this.mostrandoError = false;
    this.enviado = true;

    console.log('Información actualizada:', {
      nombreEscuela: this.nombreEscuela,
      ciudad: this.ciudad,
      direccion: this.direccion,
      telefono: this.telefono,
      email: this.email,
      website: this.website
    });
  }

  cerrar(): void {
    this.enviado = false;
    this.mostrandoError = false;
    this.nombreEscuela = '';
    this.ciudad = '';
    this.direccion = '';
    this.telefono = '';
    this.email = '';
    this.website = '';
    this.closed.emit();
  }
}