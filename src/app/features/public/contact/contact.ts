import { Component } from '@angular/core';
import { NavComponent } from "../../../shared/components/navbar/nav-component/nav-component";
import { Footer } from "../../../shared/footer/footer";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-contact',
  imports: [NavComponent, Footer, MatIcon],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {}
