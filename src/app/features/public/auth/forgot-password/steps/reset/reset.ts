import { Component } from '@angular/core';
import { NavComponent } from '../../../../../../shared/components/navbar/nav-component/nav-component';
import { Footer } from '../../../../../../shared/footer/footer';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset',
  imports: [NavComponent, Footer, MatIconModule, MatButtonModule, MatToolbarModule, RouterLink],
  templateUrl: './reset.html',
  styleUrl: './reset.css',
})
export class Reset {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    console.log('Email component initialized');
  }

  onSubmit() {
    this.router.navigate(['/auth/login']);
  }
}
