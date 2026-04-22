import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavComponent } from '../../../../../../shared/components/navbar/nav-component/nav-component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-email',
  imports: [NavComponent, MatIconModule, MatButtonModule, MatToolbarModule],
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
    this.router.navigate(['../code'], { relativeTo: this.route });
  }

  login() {
    this.router.navigate(['/auth/login']);
  }
}
