import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

const COOLDOWN_SECONDS = 30;

/** Botón "solicitar nuevo código": gris durante 30 s desde la última solicitud y luego activo. */
@Component({
  selector: 'app-resend-code',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div class="resend">
      <button
        type="button"
        class="resend-btn"
        [class.active]="canResend"
        [style.color]="canResend ? activeColor : null"
        [disabled]="!canResend"
        (click)="resend()"
      >
        {{ canResend ? ('resend_code.button' | translate) : ('resend_code.wait' | translate: { seconds: secondsLeft }) }}
      </button>
      @if (errorMessage) {
        <small class="resend-error" role="alert">{{ errorMessage }}</small>
      }
    </div>
  `,
  styles: [`
    .resend { display: flex; flex-direction: column; align-items: center; margin-top: 0; }
    .resend-btn {
      background: none; border: none; padding: 4px 8px; margin: 0; font-size: 0.9rem;
      font-weight: 600; color: #9ca3af; cursor: not-allowed; text-decoration: none;
    }
    .resend-btn.active { cursor: pointer; text-decoration: underline; }
    .resend-error { color: var(--alert-icon, #d32f2f); font-size: 0.75rem; margin-top: 4px; text-align: center; }
  `],
})
export class ResendCode implements OnInit, OnDestroy {
  @Input({ required: true }) action!: () => Observable<unknown>;
  @Input() activeColor = 'var(--button-apply)';
  @Output() resent = new EventEmitter<void>();

  secondsLeft = COOLDOWN_SECONDS;
  sending = false;
  errorMessage = '';
  private timer?: ReturnType<typeof setInterval>;

  constructor(private readonly translate: TranslateService) {}

  get canResend(): boolean {
    return this.secondsLeft <= 0 && !this.sending;
  }

  ngOnInit(): void {
    this.startCooldown();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  resend(): void {
    if (!this.canResend) {
      return;
    }

    this.errorMessage = '';
    this.sending = true;
    this.action().subscribe({
      next: () => {
        this.sending = false;
        this.startCooldown();
        this.resent.emit();
      },
      error: (error: unknown) => {
        this.sending = false;
        const status = error instanceof HttpErrorResponse ? error.status : 0;
        this.errorMessage = this.translate.instant(
          status === 429
            ? 'forgot_password.code.errors.rate_limited'
            : status === 503
              ? 'forgot_password.errors.delivery_failed'
              : 'forgot_password.code.errors.failed',
        );
        if (status === 429) {
          this.startCooldown();
        }
      },
    });
  }

  private startCooldown(): void {
    clearInterval(this.timer);
    this.secondsLeft = COOLDOWN_SECONDS;
    this.timer = setInterval(() => {
      this.secondsLeft = Math.max(0, this.secondsLeft - 1);
      if (this.secondsLeft === 0) {
        clearInterval(this.timer);
      }
    }, 1000);
  }
}