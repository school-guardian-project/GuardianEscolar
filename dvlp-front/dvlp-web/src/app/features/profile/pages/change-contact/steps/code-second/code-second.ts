import { Component } from '@angular/core';
import { NavComponent } from '../../../../../../shared/components/navbar/nav-component/nav-component';
import { PinInput } from '../../../../../../shared/components/pin-input/pin-input';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-code-second',
  imports: [NavComponent, PinInput],
  templateUrl: './code-second.html',
  styleUrl: './code-second.css',
})
export class CodeSecond {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  onSubmit() {
    this.router.navigate(['/profile']);
  }
}
