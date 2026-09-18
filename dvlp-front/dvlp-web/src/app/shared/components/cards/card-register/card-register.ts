import { Component, Input, OnInit, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CardListDataService } from '@core/api-mock/card-list.data.service';

export type RegisterType =
  | 'estudiante'
  | 'acudiente'
  | 'conductor'
  | 'familia'
  | 'bus'
  | 'parada'
  | 'ruta'
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
  estudiante: [
    { name: 'nombres', type: 'text' },
    { name: 'apellidos', type: 'text' },
    { name: 'tipoId', type: 'select', options: ['CC', 'TI', 'CE'] },
    { name: 'identificacion', type: 'text' },
    { name: 'fechaNac', type: 'date' },
    { name: 'curso', type: 'select', options: ['1°', '2°', '3°', '4°', '5°', '6°', '7°', '8°', '9°', '10°', '11°'], halfWidth: true },
    { name: 'telefono', type: 'tel', halfWidth: true },
    { name: 'direccion', type: 'text' },
    { name: 'correo', type: 'email' },
  ],
  acudiente: [
    { name: 'nombres', type: 'text' },
    { name: 'apellidos', type: 'text' },
    { name: 'correo', type: 'email' },
    { name: 'tipoId', type: 'select', options: ['CC','CE'] },
    { name: 'identificacion', type: 'text' },
    { name: 'fechaNac', type: 'date' },
    { name: 'telefono', type: 'tel' },
    { name: 'direccion', type: 'text' },
  ],

  conductor: [
    { name: 'nombres', type: 'text' },
    { name: 'apellidos', type: 'text' },
    { name: 'tipoId', type: 'select', options: ['CC','CE'] },
    { name: 'identificacion', type: 'text' },
    { name: 'fechaNac', type: 'date' },
    { name: 'vencLicencia', type: 'date', halfWidth: true },
    { name: 'licencia', type: 'text', halfWidth: true },
    { name: 'direccion', type: 'text' },
    { name: 'correo', type: 'email' },
  ],

  familia: [
    { name: 'nombre', type: 'text' },
    { name: 'acudiente', type: 'select', options: [] },
    { name: 'estudiante', type: 'select', options: [] },
    { name: 'observaciones', type: 'text' },
  ],

  bus: [
    { name: 'matricula', type: 'text' },
    { name: 'conductor', type: 'select', options: [] },
    { name: 'modelo', type: 'text' },
    { name: 'marca', type: 'text' },
    { name: 'capacidad', type: 'text' },
    { name: 'soat', type: 'date', halfWidth: true },
    { name: 'gps', type: 'select', options: ['Activo','Inactivo'], halfWidth: true },
  ],

  parada: [
    { name: 'nombre', type: 'text' },
    { name: 'estudiante', type: 'select', options: [] },
    { name: 'ciudad', type: 'select', options: [] },
    { name: 'direccion', type: 'text' },
    { name: 'latitud', type: 'text' },
    { name: 'longitud', type: 'text' },
  ],

  ruta: [
    { name: 'nombre', type: 'text' },
    { name: 'sector', type: 'text' },
    { name: 'horaInicio', type: 'text' },
    { name: 'horaFin', type: 'text' },
    { name: 'destino', type: 'text' },
    { name: 'sectorRuta', type: 'select', options: [] },
  ],

  admins: [
    { name: 'nombre', type: 'text' },
    { name: 'apellidos', type: 'text' },
    { name: 'correo', type: 'email' },
    { name: 'identificacion', type: 'text' },
    { name: 'fechaNac', type: 'date' },
    { name: 'telefono', type: 'tel' },
    { name: 'direccion', type: 'text' },
  ],

  schools: [
    { name: 'nombre', type: 'text' },
    { name: 'logo', type: 'file' },
    { name: 'ciudad', type: 'select', options: ['Bogotá'] },
    { name: 'direccion', type: 'text' },
    { name: 'telefono', type: 'tel' },
    { name: 'escolaridad', type: 'select', options: ['Primaria'] },
    { name: 'correo', type: 'email' },
    { name: 'web', type: 'text' },
  ],
};

// TODO: Reemplazar estos datos quemados cuando el formulario se conecte al servicio de familias.
const FAMILY_FORM_DATA = {
  nombre: 'Familia García López',
  acudiente: 'Rosa María González',
  estudiante: 'Juan Carlos García',
  observaciones: 'Familia con 2 hijos en el colegio',
};

const FAMILY_OPTIONS = {
  acudiente: ['Rosa María González', 'Pedro José López'],
  estudiante: ['Juan Carlos García', 'María Elena Ruiz'],
};


@Component({
  selector: 'app-card-register',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './card-register.html',
  styleUrl: './card-register.css',
})
export class CardRegister implements OnInit {
  @Input() type: RegisterType = 'estudiante';
  @Output() created = new EventEmitter<any>();

  formData: Record<string, any> = {};
  groupedFields: any[] = [];
  private dataService = inject(CardListDataService);
  private cdr = inject(ChangeDetectorRef);
  saving = false;
  message: string | null = null;
  submitted = false;
  selectedStudent = '';
  selectedStudents: string[] = [];

  isFieldInvalid(field: Field): boolean {
    if (!this.submitted) return false;
    const v = this.formData[field.name];
    if (v === undefined || v === null || String(v).trim() === '') return true;
    if (field.type === 'email' && v) {
      const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
      if (!re.test(String(v).toLowerCase())) return true;
    }
    if (field.type === 'tel' && v) {
      const re = /^\+?[0-9\s\-]{7,15}$/;
      if (!re.test(String(v))) return true;
    }
    return false;
  }

  getFieldError(field: Field): string | null {
    const v = this.formData[field.name];
    if (v === undefined || v === null || String(v).trim() === '') return 'Campo requerido';
    if (field.type === 'email') return 'Correo inválido';
    if (field.type === 'tel') return 'Teléfono inválido';
    return null;
  }

  get titleKey(): string {
    return `register.${this.type}.title`;
  }

  getLabelKey(name: string): string {
    return `register.${this.type}.fields.${name}`;
  }

  ngOnInit(): void {
    this.groupedFields = this.buildGroupedFields();
    if (this.type === 'familia') this.loadFamiliaOptions();
    if (this.type === 'bus' || this.type === 'parada') this.loadTransportOptions();
  }

  isFamilyStudentField(name: string): boolean {
    return this.type === 'familia' && name === 'estudiante';
  }

  onSelectChange(fieldName: string, value: string): void {
    if (this.isFamilyStudentField(fieldName)) {
      if (value && !this.selectedStudents.includes(value)) {
        this.selectedStudents = [...this.selectedStudents, value];
        this.formData[fieldName] = this.selectedStudents[0];
        this.formData.estudiantes = [...this.selectedStudents];
      }
      this.selectedStudent = '';
      return;
    }

    this.formData[fieldName] = value;
  }

  removeStudent(student: string): void {
    this.selectedStudents = this.selectedStudents.filter(item => item !== student);
    this.formData.estudiante = this.selectedStudents[0] ?? '';
    this.formData.estudiantes = [...this.selectedStudents];
  }

  private loadFamiliaOptions(): void {
    // Poblar selects de acudiente/estudiante con datos reales del colegio actual
    const familiaFields = FIELDS['familia'];
    const acudienteField = familiaFields.find(f => f.name === 'acudiente');
    const estudianteField = familiaFields.find(f => f.name === 'estudiante');
    if (!acudienteField || !estudianteField) return;
    acudienteField.options = [...FAMILY_OPTIONS.acudiente];
    estudianteField.options = [...FAMILY_OPTIONS.estudiante];
    // Usar CardListDataService para traer datos filtrados por colegio
    (this.dataService as any).getAcudientes?.().subscribe((list: any[]) => {
      const opts = (list || []).slice(0, 20).map((r: any) => r.correo || r.nombre || r.id).filter(Boolean);
      if (opts.length) acudienteField.options = opts;
      this.groupedFields = this.buildGroupedFields();
      this.cdr.detectChanges();
    });
    (this.dataService as any).getEstudiantes?.().subscribe((list: any[]) => {
      const opts = (list || []).slice(0, 20).map((r: any) => r.correo || r.nombre || r.id).filter(Boolean);
      if (opts.length) estudianteField.options = opts;
      this.groupedFields = this.buildGroupedFields();
      this.cdr.detectChanges();
    });
  }

  private loadTransportOptions(): void {
    const fieldName = this.type === 'bus' ? 'conductor' : 'estudiante';
    const field = FIELDS[this.type].find(item => item.name === fieldName);
    if (!field) return;

    const sourceType = this.type === 'bus' ? 'conductor' : 'estudiante';
    this.dataService.getByType(sourceType).subscribe((list: any[]) => {
      field.options = (list || [])
        .map((item: any) => item.nombre || item.nombres || item.correo || item.id)
        .filter(Boolean);
      this.groupedFields = this.buildGroupedFields();
      this.cdr.detectChanges();
    });
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
    console.log('[MOCK-API] CardRegister onSubmit', this.type, this.formData);
    this.submitted = true;
    // Validación estilo forgot-password/telephone: todos los campos visibles son requeridos
    const fields = (FIELDS as any)[this.type] as Field[];
    const hasInvalid = fields.some(f => this.isFieldInvalid(f));
    if (hasInvalid) {
      this.message = 'Revisa los campos requeridos';
      this.cdr.detectChanges();
      return;
    }
    if (!this.dataService.isMockEnabled()) {
      console.log('Datos del formulario:', this.formData);
      this.message = 'Mock deshabilitado';
      this.cdr.detectChanges();
      return;
    }
    // Defer para no mutar 'saving' en el mismo ciclo de detección (evita NG0100)
    queueMicrotask(() => {
      this.saving = true;
      this.message = 'Guardando...';
      this.cdr.detectChanges();
      this.dataService.create(this.type, this.formData).subscribe({
        next: (res) => {
          this.saving = false;
          console.log(`[MOCK-API] CREATE ${this.type} OK`, res);
          if (res) {
            this.message = '✓ Registro creado en DB (ver lista)';
            this.created.emit(res);
            this.formData = {};
            setTimeout(() => { this.message = null; this.cdr.detectChanges(); }, 3000);
          } else {
            this.message = 'No se pudo crear (ver consola)';
          }
          this.cdr.detectChanges();
        },
        error: (e) => {
          console.error('[MOCK-API] CREATE FAIL', e);
          this.saving = false;
          this.message = e?.message ?? 'Error al crear';
          this.cdr.detectChanges();
        },
      });
    });
  }
}