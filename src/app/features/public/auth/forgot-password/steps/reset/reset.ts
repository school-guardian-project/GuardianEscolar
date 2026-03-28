import { Component } from '@angular/core';
import { NavComponent } from '../../../../../../shared/components/navbar/nav-component/nav-component';
import { Footer } from '../../../../../../shared/footer/footer';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset',
  imports: [NavComponent, Footer, MatIconModule, MatButtonModule, MatToolbarModule, RouterLink],
  templateUrl: './reset.html',
  styleUrl: './reset.css',
})
export class Reset {}
