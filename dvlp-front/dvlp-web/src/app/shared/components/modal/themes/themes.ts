import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-themes',
  standalone: true,
  templateUrl: './themes.html',
  styleUrl: './themes.css',
})
export class Themes {
  @Output() close = new EventEmitter<void>();
  //Variable donde se guard el tema actual
  currentTheme = "";

  //Funcion que recibe el tema que se seleccionó
  setTheme(theme: string) {
    //donde se guarda el tema 
    this.currentTheme = theme;

    //Se aplica el tema
    document.body.className = theme;

    //Se guarda el tema
    localStorage.setItem('theme' , theme)
  }



  closeModal() {
    this.close.emit();
  }
} 0
