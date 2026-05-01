import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-themes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './themes.html',
  styleUrl: './themes.css',
})
export class Themes {
  @Output() close = new EventEmitter<void>();
  //Variable donde se guard el tema actual
  currentTheme = localStorage.getItem('theme') ?? '';

  //Funcion que recibe el tema que se seleccionó
  setTheme(theme: string) {
    //donde se guarda el tema 
    this.currentTheme = theme;

    //Se aplica el tema
    document.body.className = theme;

    //Se guarda el tema
    localStorage.setItem('theme', theme)
  }



  closeModal() {
    this.close.emit();
  }
} 
