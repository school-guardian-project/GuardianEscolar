import { AfterViewInit, Directive, ElementRef, OnDestroy, Renderer2 } from '@angular/core';

/** Añade un botón de ojo para mostrar/ocultar el contenido de un input de contraseña. */
@Directive({
  selector: 'input[appPasswordToggle]',
  standalone: true,
})
export class PasswordToggleDirective implements AfterViewInit, OnDestroy {
  private button?: HTMLButtonElement;
  private wrapper?: HTMLElement;
  private visible = false;

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit(): void {
    const input = this.el.nativeElement;
    const parent = input.parentNode;
    if (!parent) return;

    this.wrapper = this.renderer.createElement('div');
    this.renderer.setStyle(this.wrapper, 'position', 'relative');
    this.renderer.setStyle(this.wrapper, 'display', 'block');
    this.renderer.setStyle(this.wrapper, 'width', '100%');
    this.renderer.insertBefore(parent, this.wrapper, input);
    this.renderer.appendChild(this.wrapper, input);

    this.renderer.setStyle(input, 'display', 'block');
    this.renderer.setStyle(input, 'box-sizing', 'border-box');
    this.renderer.setStyle(input, 'width', '100%');
    this.renderer.setStyle(input, 'padding-right', '44px');

    const button: HTMLButtonElement = this.renderer.createElement('button');
    this.button = button;
    button.type = 'button';
    button.setAttribute('aria-pressed', 'false');
    button.innerHTML = '<i class="ph ph-eye-closed" style="font-size:20px"></i>';
    const styles: Record<string, string> = {
      position: 'absolute',
      top: '50%',
      right: '12px',
      transform: 'translateY(-50%)',
      background: 'transparent',
      border: 'none',
      padding: '0',
      margin: '0',
      width: 'auto',
      height: 'auto',
      cursor: 'pointer',
      color: 'inherit',
      display: 'flex',
      alignItems: 'center',
      opacity: '0.7',
    };
    Object.assign(button.style, styles);
    button.addEventListener('click', this.toggle);
    this.renderer.appendChild(this.wrapper, button);
  }

  private toggle = (): void => {
    this.visible = !this.visible;
    this.el.nativeElement.type = this.visible ? 'text' : 'password';
    if (this.button) {
      this.button.setAttribute('aria-pressed', String(this.visible));
      this.button.innerHTML = `<i class="ph ${this.visible ? 'ph-eye' : 'ph-eye-closed'}" style="font-size:20px"></i>`;
    }
  };

  ngOnDestroy(): void {
    this.button?.removeEventListener('click', this.toggle);
  }
}
