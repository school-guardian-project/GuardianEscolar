import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavComponent } from "../../../../../../shared/components/navbar/nav-component/nav-component";
  // fix
@Component({
  selector: 'app-reset',
  imports: [NavComponent],
  templateUrl: './reset.html',
  styleUrl: './reset.css',
})
export class Reset {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    
  }

  onSubmit() {
    this.router.navigate(['../code-second'], { relativeTo: this.route });
  }
}
