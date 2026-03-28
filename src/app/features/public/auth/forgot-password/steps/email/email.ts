import { Component } from '@angular/core';
import { Footer } from '../../../../../../shared/footer/footer';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavComponent } from '../../../../../../shared/components/navbar/nav-component/nav-component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-email',
  imports: [NavComponent, Footer, MatIconModule, MatButtonModule, MatToolbarModule, RouterLink],
  templateUrl: './email.html',
  styleUrl: './email.css',
})
export class Email {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    console.log('Email component initialized');
  }

  onSubmit() {
    console.log('Click funcionando');
    this.router.navigate(['../code'], { relativeTo: this.route });
  }
}
