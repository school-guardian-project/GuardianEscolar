import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

export type RegisterType =
  | 'student'
  | 'guardian'
  | 'driver'
  | 'family'
  | 'bus'
  | 'stop'
  | 'route'
  | 'admins'
  | 'schools';

export interface Field {
  name: string;
  type: 'text' | 'date' | 'select' | 'tel' | 'email' | 'file';
  placeholder?: string;
  options?: string[];
  halfWidth?: boolean;
}

const FIELDS: Record<RegisterType, Field[]> = {
  student: [
    { name: 'names', type: 'text' },
    { name: 'lastNames', type: 'text' },
    { name: 'documentType', type: 'select', options: ['CC', 'TI'] },
    { name: 'identification', type: 'text' },
    { name: 'birthDate', type: 'date' },
    { name: 'phone', type: 'tel', halfWidth: true },
    { name: 'address', type: 'text' },
    { name: 'email', type: 'email' },
  ],
  guardian: [
    { name: 'names', type: 'text' },
    { name: 'lastNames', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'documentType', type: 'select', options: ['CC','CE'] },
    { name: 'identification', type: 'text' },
    { name: 'birthDate', type: 'date' },
    { name: 'phone', type: 'tel' },
    { name: 'address', type: 'text' },
  ],

  driver: [
    { name: 'names', type: 'text' },
    { name: 'lastNames', type: 'text' },
    { name: 'documentType', type: 'select', options: ['CC','CE'] },
    { name: 'identification', type: 'text' },
    { name: 'birthDate', type: 'date' },
    { name: 'licenseExpiration', type: 'date', halfWidth: true },
    { name: 'licenseNumber', type: 'text', halfWidth: true },
    { name: 'address', type: 'text' },
    { name: 'email', type: 'email' },
  ],

  family: [
    { name: 'name', type: 'text' },
    { name: 'guardian', type: 'select', options: [] },
    { name: 'student', type: 'select', options: [] },
    { name: 'observaciones', type: 'text' },
  ],

  bus: [
    { name: 'matricula', type: 'text' },
    { name: 'driver', type: 'select', options: [] },
    { name: 'model', type: 'text' },
    { name: 'brand', type: 'text' },
    { name: 'capacity', type: 'text' },
    { name: 'soat', type: 'date', halfWidth: true },
    { name: 'gps', type: 'select', options: ['Activo','Inactivo'], halfWidth: true },
  ],

  stop: [
    { name: 'name', type: 'text' },
    { name: 'student', type: 'select', options: [] },
    { name: 'city', type: 'select', options: [] },
    { name: 'address', type: 'text' },
    { name: 'route', type: 'select', options: [] },
  ],

  route: [
    { name: 'name', type: 'text' },
    { name: 'sector', type: 'text' },
    { name: 'startTime', type: 'text' },
    { name: 'endTime', type: 'text' },
    { name: 'destination', type: 'text' },
    { name: 'routeSector', type: 'select', options: [] },
    { name: 'bus', type: 'select', options: [] },
  ],

  admins: [
    { name: 'name', type: 'text' },
    { name: 'lastNames', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'identification', type: 'text' },
    { name: 'birthDate', type: 'date' },
    { name: 'phone', type: 'tel' },
    { name: 'address', type: 'text' },
  ],

  schools: [
    { name: 'name', type: 'text' },
    { name: 'logo', type: 'file' },
    { name: 'city', type: 'select', options: ['Bogotá'] },
    { name: 'address', type: 'text' },
    { name: 'phone', type: 'tel' },
    { name: 'schooling', type: 'select', options: ['Primaria'] },
    { name: 'email', type: 'email' },
    { name: 'website', type: 'text' },
  ],
};

@Component({
  selector: 'app-card-register',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './card-register.html',
  styleUrl: './card-register.css',
})
export class CardRegister implements OnInit {
  @Input() type: RegisterType = 'student';
  /** Emite el formulario al padre; si nadie escucha se hace fallback a console.log. */
  @Output() formSubmit = new EventEmitter<Record<string, any>>();

  formData: Record<string, any> = {};
  groupedFields: any[] = [];
  selectedStudents: string[] = [];
  selectedStudent = '';
  validationMessage = '';

  get titleKey(): string {
    return `register.${this.type}.title`;
  }

  getLabelKey(name: string): string {
    return `register.${this.type}.fields.${name}`;
  }

  ngOnInit(): void {
    this.groupedFields = this.buildGroupedFields();

    for (const field of FIELDS[this.type]) {
      if (this.formData[field.name] === undefined) {
        this.formData[field.name] = '';
      }
    }
  }

  isFamilyStudentField(fieldName: string): boolean {
    return this.type === 'family' && fieldName === 'student';
  }

  onSelectChange(fieldName: string, value: string): void {
    if (this.isFamilyStudentField(fieldName)) {
      this.selectedStudent = value;
      this.onStudentSelected();
      return;
    }

    this.formData[fieldName] = value;
  }

  onStudentSelected(): void {
    if (this.selectedStudent && !this.selectedStudents.includes(this.selectedStudent)) {
      this.selectedStudents = [...this.selectedStudents, this.selectedStudent];
      this.formData['student'] = [...this.selectedStudents];
    }

    this.selectedStudent = '';
  }

  removeStudent(student: string): void {
    this.selectedStudents = this.selectedStudents.filter((selected) => selected !== student);
    this.formData['student'] = [...this.selectedStudents];
  }

  private buildGroupedFields() {
    const result: any[] = [];
    const list = FIELDS[this.type];
    let i = 0;
    while (i < list.length) {
      if (list[i].halfWidth && list[i + 1]?.halfWidth) {
        result.push([list[i], list[i + 1]]);
        i += 2;
      } else {
        result.push(list[i]);
        i++;
      }
    }
    return result;
  }

  isArray(val: any): boolean {
    return Array.isArray(val);
  }

  onSubmit(): void {
    const hasEmptyField = FIELDS[this.type].some((field) => {
      const value = this.formData[field.name];
      return Array.isArray(value) ? value.length === 0 : !String(value ?? '').trim();
    });

    if (hasEmptyField) {
      this.validationMessage = 'Completa todos los campos antes de registrar.';
      return;
    }

    this.validationMessage = '';
    if (this.formSubmit.observed) {
      this.formSubmit.emit({ ...this.formData });
      return;
    }
    this.validationMessage = 'Este formulario todavía no está conectado a un servicio de registro.';
  }

  setValidationMessage(message: string): void {
    this.validationMessage = message;
  }

  resetForm(): void {
    this.formData = {};
    this.selectedStudents = [];
    this.selectedStudent = '';
    this.validationMessage = '';
    for (const field of FIELDS[this.type]) {
      this.formData[field.name] = '';
    }
  }
}