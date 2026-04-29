import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeInformation } from "../../../../../../shared/components/change/change-information/change-information";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Confirmations } from '../../../../../../shared/components/modal/confirmations/confirmations';

@Component({
  selector: 'app-code-second',
  imports: [ChangeInformation, ReactiveFormsModule, NgFor],
  templateUrl: './code-second.html',
  styleUrl: './code-second.css',
})
export class CodeSecond {
  form: FormGroup;
  readonly dialog = inject(MatDialog);

  constructor(private router: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      pin: this.fb.array(
        Array.from({ length: 6 }, () =>
          this.fb.control('', [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9]$')
          ])
        )
      )
    })
  }

  get pinControls() {
    return this.form.get('pin') as any;
  }

  onInput(event: any, index: number) {
    const value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    const control = this.pinControls.at(index);
    control.setValue(value, { emitEvent: false });

    // mover al siguiente input
    if (value && index < 5) {
      const inputs = document.querySelectorAll('input');
      (inputs[index + 1] as HTMLElement)?.focus();
    }
  }

  onSubmit() {
    const pin = this.pinControls.value.join('');
    if (this.form.valid) {
      this.openDialog();
    }
    else {
      this.form.markAllAsTouched();
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(Confirmations, {
      data: {
        titleDialog: 'Telefono actualizado',
        descriptionDialog: 'Su telefono ha sido actualizado correctamente.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'accept') {
        this.accept()
      }
    })
  }

  accept() {
    this.router.navigate(['/admin/informacion']);
  }

  return() {
    this.router.navigate(['/admin/change-contact/reset']);
  }
}
