import { Component } from '@angular/core';
import { Footer } from '../../../../../shared/footer/footer';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavComponent } from '../../../../../shared/nav-component/nav-component';
import { PinInput } from '../../../../../shared/pin-input/pin-input';

@Component({
  selector: 'app-code',
  imports: [NavComponent, Footer, MatIconModule, MatButtonModule, MatToolbarModule, RouterLink, PinInput],
  templateUrl: './code.html',
  styleUrl: './code.css',
})
export class Code {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  onSubmit() {
    this.router.navigate(['../reset'], { relativeTo: this.route });
  }
}
