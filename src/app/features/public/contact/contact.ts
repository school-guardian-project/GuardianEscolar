import { Component } from '@angular/core';
import { NavComponent } from "../../../shared/components/navbar/nav-component/nav-component";
import { Footer } from "../../../shared/footer/footer";

@Component({
  selector: 'app-contact',
  imports: [NavComponent, Footer],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {}
