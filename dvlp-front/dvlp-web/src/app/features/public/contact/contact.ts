import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NavComponent } from "../../../shared/components/navbar/nav-component/nav-component";
import { Footer } from "../../../shared/footer/footer";
import { MatIcon } from "@angular/material/icon";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [NavComponent, Footer, MatIcon, TranslateModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements OnInit, OnDestroy {
  private translate = inject(TranslateService);
  private langChangeSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      // El pipe de traducción actualiza automáticamente el contenido,
      // pero mantenemos la suscripción para reflejar el cambio de idioma.
    });
  }

  ngOnDestroy(): void {
    this.langChangeSubscription?.unsubscribe();
  }
}
