import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { NavComponent } from "@shared/components/navbar/nav-component/nav-component";
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-information',
  standalone: true,
  imports: [MatIcon, NavComponent, ReactiveFormsModule],
  templateUrl: './change-information.html',
  styleUrl: './change-information.css',
})
export class ChangeInformation {
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
    return [1, 2, 3, 4];
  }

  isStepActive(step: number): boolean {
    return step <= this.currentStep;
  }

  @Output() submit = new EventEmitter<void>();
  @Output() return = new EventEmitter<void>();
}
