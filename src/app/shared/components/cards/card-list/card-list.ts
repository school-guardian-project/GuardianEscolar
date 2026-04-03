import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';  

export type CardType = 
  |'estudiante' 
  | 'acudiente' 
  | 'conductor' 
  | 'familia' 
  | 'bus' 
  | 'parada' 
  | 'ruta';

const TITLES: Record<CardType, string> = {
  estudiante: 'Estudiantes registrados',
  acudiente: 'Acudientes registrados',
  conductor: 'Conductores registrados',
  familia: 'Familias registradas',
  bus: 'Buses registrados',
  parada: 'Paradas registradas',
  ruta: 'Rutas registradas',
};

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './card-list.html',
  styleUrl: './card-list.css',
})
export class CardList {
  @Input() type: CardType = 'estudiante';

  get title(): string {
    return TITLES[this.type];
  }
}