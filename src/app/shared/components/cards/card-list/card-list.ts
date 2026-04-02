import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './card-list.html',
  styleUrl: './card-list.css',
})
export class CardList {}
