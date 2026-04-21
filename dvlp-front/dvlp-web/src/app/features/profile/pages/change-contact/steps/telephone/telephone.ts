import { Component } from '@angular/core';
import { NavComponent } from "../../../../../../shared/components/navbar/nav-component/nav-component";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-telephone',
  imports: [NavComponent],
  templateUrl: './telephone.html',
  styleUrl: './telephone.css',
})
export class Telephone {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    
  }

  onSubmit() {
    this.router.navigate(['../code-first'], { relativeTo: this.route });
  }
}
