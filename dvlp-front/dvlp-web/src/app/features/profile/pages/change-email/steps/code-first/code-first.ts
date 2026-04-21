import { Component } from '@angular/core';
import { NavComponent } from "../../../../../../shared/components/navbar/nav-component/nav-component";
import { PinInput } from "../../../../../../shared/components/pin-input/pin-input";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-code-first',
  imports: [NavComponent, PinInput],
  templateUrl: './code-first.html',
  styleUrl: './code-first.css',
})
export class CodeFirst {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    
  }

  onSubmit() {
    this.router.navigate(['../reset'], { relativeTo: this.route });
  }
}
