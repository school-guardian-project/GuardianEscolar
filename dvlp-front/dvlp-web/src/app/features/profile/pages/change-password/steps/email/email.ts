import { Component } from '@angular/core';
import { NavComponent } from "../../../../../../shared/components/navbar/nav-component/nav-component";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-email',
  imports: [NavComponent],
  templateUrl: './email.html',
  styleUrl: './email.css',
})
export class Email {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    
  }

  onSubmit() {
    this.router.navigate(['../code'], { relativeTo: this.route });
  }
}
