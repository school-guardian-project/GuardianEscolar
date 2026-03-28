import { Component } from '@angular/core';
import { Footer } from '../../../../shared/footer/footer';
import { NavComponent } from '../../../../shared/components/navbar/nav-component/nav-component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [Footer, NavComponent, MatIconModule, MatButtonModule, MatToolbarModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  IniciarSesion() {
    console.log('Botón presionado');
    this.router.navigate(['/dashboard/admin']);
  }
}