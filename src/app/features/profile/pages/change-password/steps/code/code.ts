import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavComponent } from "../../../../../../shared/components/navbar/nav-component/nav-component";
import { PinInput } from "../../../../../../shared/components/pin-input/pin-input";

@Component({
  selector: 'app-code',
  imports: [NavComponent, PinInput],
  templateUrl: './code.html',
  styleUrl: './code.css',
})
export class Code {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    
  }

  onSubmit() {
    this.router.navigate(['../reset'], { relativeTo: this.route });
  }
}
