import { Component, Input, OnChanges, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { validateField, validateBirthDate, validateFutureDate, ValidationSchema } from '@core/validators/form-validators';
import { LocationMap } from '@shared/components/location-map/location-map';
import { CampusesService } from '@core/services/campuses.service';
import { VehicleTypesService } from '@core/services/vehicle-types.service';
import { AuthService } from '@core/services/auth.service';

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
    { name: 'observations', type: 'text' },
  ],

  bus: [
    { name: 'matricula', type: 'text' },
    { name: 'driver', type: 'select', options: [] },
    { name: 'campus', type: 'select', options: [] },
    { name: 'brand', type: 'select', options: [] },
    { name: 'model', type: 'select', options: [] },
    { name: 'capacity', type: 'text' },
    { name: 'soat', type: 'date', halfWidth: true },
    { name: 'gps', type: 'select', options: ['Activo','Inactivo'], halfWidth: true },
  ],

  stop: [
    { name: 'name', type: 'text' },
    { name: 'student', type: 'select', options: [] },
    { name: 'city', type: 'select', options: [] },
    { name: 'school', type: 'select', options: [] },
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

const VALIDATION_SCHEMAS: Record<RegisterType, ValidationSchema> = {
  student: {
    names: { required: true, pattern: 'text', minLength: 2 },
    lastNames: { required: true, pattern: 'text', minLength: 2 },
    documentType: { required: true },
    identification: { required: true, pattern: 'number', minLength: 5 },
    birthDate: { required: true, custom: validateBirthDate },
    phone: { required: true, pattern: 'phone' },
    address: { required: true, minLength: 5 },
    email: { required: true, pattern: 'email' },
  },
  guardian: {
    names: { required: true, pattern: 'text', minLength: 2 },
    lastNames: { required: true, pattern: 'text', minLength: 2 },
    email: { required: true, pattern: 'email' },
    documentType: { required: true },
    identification: { required: true, pattern: 'number', minLength: 5 },
    birthDate: { required: true, custom: validateBirthDate },
    phone: { required: true, pattern: 'phone' },
    address: { required: true, minLength: 5 },
  },
  driver: {
    names: { required: true, pattern: 'text', minLength: 2 },
    lastNames: { required: true, pattern: 'text', minLength: 2 },
    documentType: { required: true },
    identification: { required: true, pattern: 'number', minLength: 5 },
    birthDate: { required: true, custom: validateBirthDate },
    licenseExpiration: { required: true, custom: validateFutureDate },
    licenseNumber: { required: true, minLength: 5 },
    address: { required: true, minLength: 5 },
    email: { required: true, pattern: 'email' },
  },
  family: {
    name: { required: true, minLength: 2 },
    guardian: { required: true },
    student: { required: true },
    observations: { required: false },
  },
  bus: {
    matricula: { required: true, minLength: 3 },
    driver: { required: true },
    campus: { required: true },
    brand: { required: true },
    model: { required: true },
    capacity: { required: true, pattern: 'number', min: 1, max: 100 },
    soat: { required: true, custom: validateFutureDate },
    gps: { required: true },
  },
  stop: {
    name: { required: true, minLength: 2, maxLength: 30 },
    student: { required: false },
    city: { required: true },
    school: { required: true },
    address: { required: true, minLength: 5, maxLength: 100 },
    route: { required: true },
  },
  route: {
    name: { required: true, minLength: 2 },
    sector: { required: true },
    startTime: { required: true },
    endTime: { required: true },
    destination: { required: true },
    routeSector: { required: true },
    bus: { required: true },
  },
  admins: {
    name: { required: true, pattern: 'text', minLength: 2 },
    lastNames: { required: true, pattern: 'text', minLength: 2 },
    email: { required: true, pattern: 'email' },
    identification: { required: true, pattern: 'number', minLength: 5 },
    birthDate: { required: true, custom: validateBirthDate },
    phone: { required: true, pattern: 'phone' },
    address: { required: true, minLength: 5 },
  },
  schools: {
    name: { required: true, minLength: 2 },
    logo: { required: false },
    city: { required: true },
    address: { required: true, minLength: 5 },
    phone: { required: true, pattern: 'phone' },
    schooling: { required: true },
    email: { required: true, pattern: 'email' },
    website: { required: false },
  },
};

@Component({
  selector: 'app-card-register',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, LocationMap],
  templateUrl: './card-register.html',
  styleUrl: './card-register.css',
})
export class CardRegister implements OnInit, OnChanges {
  @Input() type: RegisterType = 'student';
  @Input() fieldOptions: Record<string, string[]> = {};
  @Output() formSubmit = new EventEmitter<Record<string, any>>();

  private translate = inject(TranslateService);
  private campusesService = inject(CampusesService);
  private vehicleTypesService = inject(VehicleTypesService);
  private authService = inject(AuthService);

  formData: Record<string, any> = {};
  groupedFields: any[] = [];
  selectedStudents: string[] = [];
  selectedStudent = '';
  validationMessage = '';
  fieldErrors: Record<string, string> = {};
  
  // Dropdown data
  campuses: { id: string; name: string }[] = [];
  brands: { id: number; name: string }[] = [];
  models: { id: number; name: string; brandId: number }[] = [];
  selectedBrandId: number | null = null;

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
    
    // Load dropdown data for bus form
    if (this.type === 'bus') {
      this.loadCampuses();
      this.loadBrands();
    }
  }

  ngOnChanges(): void {
    this.groupedFields = this.buildGroupedFields();
  }

  loadCampuses(): void {
    const schoolId = this.authService.session.campusId; // Using campusId as schoolId for now
    if (schoolId) {
      this.campusesService.listBySchool(schoolId).subscribe({
        next: (campuses) => {
          this.campuses = campuses;
        },
        error: (err) => {
          console.error('Error loading campuses:', err);
        }
      });
    }
  }

  loadBrands(): void {
    this.vehicleTypesService.listBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
      },
      error: (err) => {
        console.error('Error loading brands:', err);
      }
    });
  }

  onBrandChange(brandId: number): void {
    this.selectedBrandId = brandId;
    this.formData['model'] = ''; // Reset model when brand changes
    this.models = [];
    
    if (brandId) {
      this.vehicleTypesService.listModels(brandId).subscribe({
        next: (models) => {
          this.models = models;
        },
        error: (err) => {
          console.error('Error loading models:', err);
        }
      });
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
    this.validateField(fieldName);
    
    // Handle brand change for bus form
    if (this.type === 'bus' && fieldName === 'brand') {
      this.onBrandChange(Number(value));
    }
  }

  onLocationChange(coordinates: { latitude: number; longitude: number }): void {
    this.formData['latitude'] = coordinates.latitude;
    this.formData['longitude'] = coordinates.longitude;
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
    const list = FIELDS[this.type].map((field) =>
      this.fieldOptions[field.name] ? { ...field, options: this.fieldOptions[field.name] } : field,
    );
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

  validateField(fieldName: string): void {
    const schema = VALIDATION_SCHEMAS[this.type];
    const rule = schema[fieldName];
    if (!rule) return;

    const value = this.formData[fieldName];
    const error = validateField(value, rule);

    if (error) {
      this.fieldErrors[fieldName] = this.translate.instant(`validation.${this.getErrorKey(error)}`, { min: rule.minLength ?? rule.min, max: rule.maxLength ?? rule.max });
    } else {
      delete this.fieldErrors[fieldName];
    }
  }

  private getErrorKey(error: string): string {
    if (error.includes('requerido') || error.includes('required')) return 'required';
    if (error.includes('Correo') || error.includes('email')) return 'email';
    if (error.includes('Teléfono') || error.includes('phone')) return 'phone';
    if (error.includes('Mínimo') || error.includes('Minimum')) return 'minLength';
    if (error.includes('Máximo') || error.includes('Maximum')) return 'maxLength';
    if (error.includes('número') || error.includes('number')) return 'number';
    if (error.includes('letras') || error.includes('letters')) return 'text';
    if (error.includes('futura') || error.includes('future')) return 'birthDate';
    return 'required';
  }

  getFieldError(fieldName: string): string {
    return this.fieldErrors[fieldName] || '';
  }

  getCampusName(campusId: string): string {
    const campus = this.campuses.find(c => c.id === campusId);
    return campus ? campus.name : '';
  }

  getBrandName(brandId: number): string {
    const brand = this.brands.find(b => b.id === brandId);
    return brand ? brand.name : '';
  }

  getModelName(modelId: number): string {
    const model = this.models.find(m => m.id === modelId);
    return model ? model.name : '';
  }

  onSubmit(): void {
    const schema = VALIDATION_SCHEMAS[this.type];
    this.fieldErrors = {};

    for (const field of FIELDS[this.type]) {
      const rule = schema[field.name];
      if (!rule) continue;

      const value = this.formData[field.name];
      const error = validateField(value, rule);

      if (error) {
        this.fieldErrors[field.name] = this.translate.instant(`validation.${this.getErrorKey(error)}`, { min: rule.minLength ?? rule.min, max: rule.maxLength ?? rule.max });
      }
    }

    if (Object.keys(this.fieldErrors).length > 0) {
      this.validationMessage = '';
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
    this.fieldErrors = {};
    for (const field of FIELDS[this.type]) {
      this.formData[field.name] = '';
    }
  }
}
