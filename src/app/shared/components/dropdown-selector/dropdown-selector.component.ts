import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, of, Subject } from 'rxjs';
import { catchError, takeUntil, finalize } from 'rxjs/operators';

export interface DropdownOption {
  value: string | number;
  label: string;
}

@Component({
  selector: 'app-dropdown-selector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  template: `
    <mat-form-field appearance="outline" class="w-full">
      <mat-label>{{ label | translate }}</mat-label>
      <mat-select [formControl]="control" (selectionChange)="onSelect($event.value)">
        <mat-option *ngFor="let option of options" [value]="option.value">
          {{ option.label }}
        </mat-option>
      </mat-select>
      <mat-hint *ngIf="hint">{{ hint | translate }}</mat-hint>
      <mat-spinner *ngIf="loading" diameter="20" matSuffix></mat-spinner>
    </mat-form-field>
  `,
  styles: [`
    :host {
      display: block;
    }
    .w-full {
      width: 100%;
    }
    mat-spinner {
      margin-right: 8px;
    }
  `]
})
export class DropdownSelectorComponent implements OnInit, OnDestroy {
  @Input() label = '';
  @Input() hint = '';
  @Input() control = new FormControl<string | number | null>(null);
  @Input() loadOptions: () => Observable<DropdownOption[]> = () => of([]);
  @Input() required = false;
  @Output() selectionChange = new EventEmitter<string | number>();
  @Output() optionsLoaded = new EventEmitter<DropdownOption[]>();

  options: DropdownOption[] = [];
  loading = false;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadOptionsData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOptionsData(): void {
    this.loading = true;
    this.loadOptions()
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          console.error('Error loading dropdown options:', err);
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((options) => {
        this.options = options;
        this.optionsLoaded.emit(options);
      });
  }

  onSelect(value: string | number): void {
    this.selectionChange.emit(value);
  }
}
