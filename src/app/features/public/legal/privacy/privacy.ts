import { Component } from '@angular/core';
import { NavComponent } from '@shared/components/navbar/nav-component/nav-component';
import { Footer } from '@shared/footer/footer';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [NavComponent, Footer, TranslateModule, RouterLink],
  templateUrl: './privacy.html',
  styleUrl: '../legal.css',
})
export class Privacy {}
