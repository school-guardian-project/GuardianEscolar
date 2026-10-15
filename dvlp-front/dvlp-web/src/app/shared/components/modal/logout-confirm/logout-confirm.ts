import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-logout-confirm',
  standalone: true,
  imports: [MatIconModule, TranslateModule],
  templateUrl: './logout-confirm.html',
  styleUrl: './logout-confirm.css',
})
export class LogoutConfirm {
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}