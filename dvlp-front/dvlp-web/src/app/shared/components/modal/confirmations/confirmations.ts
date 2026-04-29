import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-confirmations',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, MatIcon],
  templateUrl: './confirmations.html',
  styleUrl: './confirmations.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Confirmations {
  // data es la informacion que envio
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<Confirmations>);
}
