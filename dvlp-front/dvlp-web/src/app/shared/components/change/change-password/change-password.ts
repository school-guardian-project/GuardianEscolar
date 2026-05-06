import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { NavComponent } from "@shared/components/navbar/nav-component/nav-component";
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-change-password',
  standalone: true, 
  imports: [MatIcon, NavComponent, ReactiveFormsModule, TranslateModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword {
  @Input() iconHead = '';
  @Input() title = '';
  @Input() sessionDescription = '';
  @Input() titleStep = '';
  @Input() loginDescription = '';
  @Input() buttonText = '';
  @Input() returnStep = '';
  @Input() showProgress = false;
  @Input() currentStep = 1;
  @Input() stepText = '';

  getProgressBars(): number[] {
    return [1, 2, 3];
  }

  isStepActive(step: number): boolean {
    return step <= this.currentStep;
  }

  @Output() submit = new EventEmitter<void>();
  @Output() return = new EventEmitter<void>();
}