import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

/** Permite pegar un código completo desde cualquier casilla y retroceder con Backspace entre casillas. */
@Directive({
  selector: '[appPinGroup]',
  standalone: true,
})
export class PinGroupDirective {
  @Input('appPinGroup') controls!: FormArray<FormControl<string>>;

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  private get inputs(): HTMLInputElement[] {
    return Array.from(this.host.nativeElement.querySelectorAll('input'));
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const digits = (event.clipboardData?.getData('text') ?? '').replace(/\D/g, '');
    if (!digits) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    const inputs = this.inputs;
    const length = this.controls.length;
    for (let i = 0; i < length; i++) {
      const digit = digits[i] ?? '';
      this.controls.at(i).setValue(digit);
      if (inputs[i]) {
        inputs[i].value = digit;
      }
    }
    inputs[Math.min(digits.length, length - 1)]?.focus();
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const inputs = this.inputs;
    const index = inputs.indexOf(event.target as HTMLInputElement);
    if (index < 0) {
      return;
    }
    if (event.key === 'Backspace' && !inputs[index].value && index > 0) {
      this.controls.at(index - 1).setValue('');
      inputs[index - 1].value = '';
      inputs[index - 1].focus();
      event.preventDefault();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      inputs[index - 1].focus();
    } else if (event.key === 'ArrowRight' && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
  }
}