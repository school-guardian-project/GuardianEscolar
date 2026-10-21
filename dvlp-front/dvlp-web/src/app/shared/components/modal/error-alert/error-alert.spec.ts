import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ErrorAlert } from './error-alert';

describe('ErrorAlert', () => {
  let component: ErrorAlert;
  let fixture: ComponentFixture<ErrorAlert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorAlert, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorAlert);
    component = fixture.componentInstance;
    component.message = 'No se pudieron cargar los conductores.';
    fixture.detectChanges();
  });

  it('shows the message it receives', () => {
    const text = fixture.nativeElement.querySelector('#error-alert-message').textContent;
    expect(text).toContain('No se pudieron cargar los conductores.');
  });

  it('emits closed from both buttons', () => {
    let count = 0;
    component.closed.subscribe(() => count++);
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    buttons.forEach((button) => button.click());
    expect(count).toBe(2);
  });

  it('emits closed when clicking the backdrop but not the dialog', () => {
    let count = 0;
    component.closed.subscribe(() => count++);
    fixture.nativeElement.querySelector('.modal').click();
    expect(count).toBe(0);
    fixture.nativeElement.querySelector('.modal-overlay').click();
    expect(count).toBe(1);
  });
});
