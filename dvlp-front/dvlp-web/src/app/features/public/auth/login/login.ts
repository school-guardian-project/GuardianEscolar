import { Component } from '@angular/core';
import { NavComponent } from '../../../../shared/components/navbar/nav-component/nav-component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NavComponent, MatIconModule, MatButtonModule, MatToolbarModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  login() {
    console.log('Botón presionado');
    this.router.navigate(['/dashboard/admin']);
  }
}