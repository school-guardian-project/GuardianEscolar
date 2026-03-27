import { NgFor } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-pin-input',
  imports: [FormsModule, NgFor],
  templateUrl: './pin-input.html',
  styleUrl: './pin-input.css',
})
export class PinInput {
  value: string = '';
  boxes = Array(6);

  @ViewChild('hiddenInput')  input!: ElementRef;

  focusInput() {
    this.input.nativeElement.focus();
  }

  onInput() {
    this.value = this.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  }
}
