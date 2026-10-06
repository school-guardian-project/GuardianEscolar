import { Component, Input, OnChanges, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { validateField, validateBirthDate, validateFutureDate, ValidationSchema } from '@core/validators/form-validators';
import { LocationMap } from '@shared/components/location-map/location-map';
import { CampusesService } from '@core/services/campuses.service';
import { CitiesService } from '@core/services/cities.service';
import { SchoolsService } from '@core/services/schools.service';
import { VehicleTypesService } from '@core/services/vehicle-types.service';
import { AuthService } from '@core/services/auth.service';

/** Opción de select: el id va al backend, el texto se muestra. */
export interface SelectOption {
  value: string;
  label: string;
}

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

/**
 * De donde salen las opciones de un `select`.
 *
 * Existe para que el componente cargue la lista y el valor del formulario sea el
 * **id**, no el texto visible: `campus`/`school`/`city` van al backend como
 * UUIDs. Las opciones que vienen en `options` siguen usando el texto como valor,
 * que es como funciona `documentType` y el resto de selects estáticos.
 */
export type OptionsSource = 'campus' | 'school' | 'city' | 'brand' | 'model';

export interface Field {
  name: string;
  type: 'text' | 'date' | 'select' | 'tel' | 'email' | 'file';
  placeholder?: string;
  options?: string[];
  optionsSource?: OptionsSource;
  halfWidth?: boolean;
}

const FIELDS: Record<RegisterType, Field[]> = {
  student: [
    { name: 'names', type: 'text' },
    { name: 'lastNames', type: 'text' },
    { name: 'documentType', type: 'select', options: ['CC', 'TI'] },
    { name: 'identification', type: 'text' },
    { name: 'birthDate', type: 'date' },
    // La sede define a que ruta puede aspirar un estudiante, asi que es tan
    // obligatoria como el correo: sin ella la alta se acepta y el registro no
    // sirve para asignarle paradas.
    { name: 'campus', type: 'select', optionsSource: 'campus' },
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
    { name: 'campus', type: 'select', optionsSource: 'campus' },
    { name: 'phone', type: 'tel' },
    { name: 'address', type: 'text' },
  ],

  driver: [
    { name: 'names', type: 'text' },
    { name: 'lastNames', type: 'text' },
    { name: 'documentType', type: 'select', options: ['CC','CE'] },
    { name: 'identification', type: 'text' },
    { name: 'birthDate', type: 'date' },
    { name: 'campus', type: 'select', optionsSource: 'campus' },
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
    { name: 'campus', type: 'select', optionsSource: 'campus' },
    { name: 'brand', type: 'select', optionsSource: 'brand' },
    { name: 'model', type: 'select', optionsSource: 'model' },
    { name: 'capacity', type: 'text' },
    { name: 'soat', type: 'date', halfWidth: true },
    { name: 'gps', type: 'select', options: ['Activo','Inactivo'], halfWidth: true },
  ],

  stop: [
    { name: 'name', type: 'text' },
    { name: 'student', type: 'select', options: [] },
    // city/school/route siguen siendo labels: stops.ts resuelve label -> id en
    // el payload. Dejarlo asi a proposito, aunque `schools.city` si lleve id.
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
    // El colegio y no la sede: un admin opera un colegio completo y su relación
    // vive en School.SchoolAdmin. Ponerle sede aca haría que su token llegara
    // con campusId en vez de schoolId y no pudiera ver nada de su colegio.
    { name: 'school', type: 'select', optionsSource: 'school' },
    { name: 'email', type: 'email' },
    { name: 'identification', type: 'text' },
    { name: 'birthDate', type: 'date' },
    { name: 'phone', type: 'tel' },
    { name: 'address', type: 'text' },
  ],

  schools: [
    { name: 'name', type: 'text' },
    { name: 'logo', type: 'file' },
    // La ciudad identifica el colegio; las sedes se declaran abajo, con nombre.
    { name: 'city', type: 'select', optionsSource: 'city' },
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
    campus: { required: true },
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
    campus: { required: true },
    phone: { required: true, pattern: 'phone' },
    address: { required: true, minLength: 5 },
  },
  driver: {
    names: { required: true, pattern: 'text', minLength: 2 },
    lastNames: { required: true, pattern: 'text', minLength: 2 },
    documentType: { required: true },
    identification: { required: true, pattern: 'number', minLength: 5 },
    birthDate: { required: true, custom: validateBirthDate },
    campus: { required: true },
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
    school: { required: true },
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
  private citiesService = inject(CitiesService);
  private schoolsService = inject(SchoolsService);
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
  cities: { id: string; name: string }[] = [];
  schools: { id: string; name: string }[] = [];
  brands: { id: number; name: string }[] = [];
  models: { id: number; name: string; brandId: number }[] = [];
  selectedBrandId: number | null = null;

  /**
   * Nombres de las sedes del colegio por registrar. Van como texto plano: no
   * existen todavia, asi que no hay id que elegir. Se envian en `campusNames`.
   */
  campusNames: string[] = [''];
  campusNamesError = '';

  /** true cuando no se pudieron cargar las opciones de un select. */
  optionsLoadError: Partial<Record<OptionsSource, boolean>> = {};

  /** Fuentes cuyo listado ya resolvio (bien o mal) — para distinguir "cargando" de "vacio". */
  private readonly sourceLoaded = new Set<OptionsSource>();

  get titleKey(): string {
    return `register.${this.type}.title`;
  }

  getLabelKey(name: string): string {
    return `register.${this.type}.fields.${name}`;
  }

  /**
   * Sedes del colegio del admin en sesion.
   *
   * Sale de `schoolId`, que es el claim del colegio que administra. El antiguo
   * `session.campusId` estaba mal: para un admin esa columna es null, asi que el
   * dropdown quedaba siempre vacio.
   */
  get schoolId(): string | null {
    return this.authService.session.schoolId;
  }

  ngOnInit(): void {
    this.groupedFields = this.buildGroupedFields();
    for (const field of FIELDS[this.type]) {
      if (this.formData[field.name] === undefined) {
        this.formData[field.name] = '';
      }
    }

    this.loadOptions();
  }

  ngOnChanges(): void {
    this.groupedFields = this.buildGroupedFields();
  }

  /** Carga las listas que usa el tipo de formulario concreto. */
  private loadOptions(): void {
    const sources = new Set(
      FIELDS[this.type]
        .map((f) => f.optionsSource)
        .filter((s): s is OptionsSource => !!s),
    );

    if (sources.has('campus')) {
      this.loadCampuses();
    }
    if (sources.has('city')) {
      this.loadCities();
    }
    if (sources.has('school')) {
      this.loadSchools();
    }
    if (sources.has('brand')) {
      this.loadBrands();
    }
  }

  loadCampuses(): void {
    const schoolId = this.schoolId;
    if (!schoolId) {
      // Sin colegio no hay sedes que mostrar. Es el caso de un superadmin en la
      // pantalla: el campo sigue visible y bloqueado por validacion, que es
      // mejor que un dropdown vacio que parece funcionar mal.
      this.campuses = [];
      this.optionsLoadError['campus'] = false;
      this.sourceLoaded.add('campus');
      return;
    }
    this.campusesService.listBySchool(schoolId).subscribe({
      next: (campuses) => {
        this.campuses = campuses;
        this.optionsLoadError['campus'] = false;
        this.sourceLoaded.add('campus');
      },
      error: (err) => {
        console.error('Error loading campuses:', err);
        this.optionsLoadError['campus'] = true;
        this.sourceLoaded.add('campus');
      }
    });
  }

  loadCities(): void {
    this.citiesService.list().subscribe({
      next: (cities) => {
        this.cities = cities;
        this.optionsLoadError['city'] = false;
        this.sourceLoaded.add('city');
      },
      error: (err) => {
        console.error('Error loading cities:', err);
        this.optionsLoadError['city'] = true;
        this.sourceLoaded.add('city');
      }
    });
  }

  loadSchools(): void {
    this.schoolsService.list().subscribe({
      next: (schools) => {
        this.schools = schools;
        this.optionsLoadError['school'] = false;
        this.sourceLoaded.add('school');
      },
      error: (err) => {
        console.error('Error loading schools:', err);
        this.optionsLoadError['school'] = true;
        this.sourceLoaded.add('school');
      }
    });
  }

  loadBrands(): void {
    this.vehicleTypesService.listBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
        this.optionsLoadError['brand'] = false;
        this.sourceLoaded.add('brand');
      },
      error: (err) => {
        console.error('Error loading brands:', err);
        this.optionsLoadError['brand'] = true;
        this.sourceLoaded.add('brand');
      }
    });
  }

  /**
   * Opciones a renderizar para un campo. Un solo camino para todos los selects:
   * lo que venga de `fieldOptions` y de `options` conserva el texto como valor
   * (documentType y los selects alimentados por la página), y lo que tenga
   * `optionsSource` aporta el id como valor y el nombre como etiqueta.
   */
  getOptions(field: Field): SelectOption[] {
    if (field.optionsSource) {
      return this.getSourceOptions(field.optionsSource);
    }
    const labels = this.fieldOptions[field.name] ?? field.options;
    return (labels ?? []).map((label) => ({ value: label, label }));
  }

  private getSourceOptions(source: OptionsSource): SelectOption[] {
    switch (source) {
      case 'campus':
        return this.campuses.map((c) => ({ value: c.id, label: c.name }));
      case 'city':
        return this.cities.map((c) => ({ value: c.id, label: c.name }));
      case 'school':
        return this.schools.map((s) => ({ value: s.id, label: s.name }));
      case 'brand':
        return this.brands.map((b) => ({ value: String(b.id), label: b.name }));
      case 'model':
        return this.models.map((m) => ({ value: String(m.id), label: m.name }));
    }
  }

  /** Todavia no se resolvio este `optionsSource`; evita parpadear "sin opciones". */
  isOptionsLoading(field: Field): boolean {
    const source = field.optionsSource;
    return !!source && !this.sourceLoaded.has(source);
  }

  /**
   * El select quedo sin opciones y no por falta de datos: fallo la carga o no hay
   * colegio en sesion. Se muestra un aviso en vez de un dropdown vacio, que en un
   * formulario obligatorio se lee como "esta roto".
   */
  showOptionsUnavailable(field: Field): boolean {
    const source = field.optionsSource;
    if (!source || this.isOptionsLoading(field)) return false;
    return this.optionsLoadError[source] === true || this.getOptions(field).length === 0;
  }

  /**
   * Clave de i18n del aviso. Se distingue "no hay colegio en sesion" de "no se
   * pudo cargar": la primera se arregla entrando con el rol correcto y la segunda
   * es un problema nuestro. Decir solo "sin opciones" mezcla las dos.
   */
  optionsUnavailableKey(field: Field): string {
    if (field.optionsSource === 'campus' && !this.optionsLoadError['campus'] && !this.schoolId) {
      return 'register.options.noSchool';
    }
    if (this.optionsLoadError[field.optionsSource!]) {
      return 'register.options.loadError';
    }
    return 'register.options.empty';
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
    // `fieldOptions` se resuelve dentro de `getOptions`, asi que aqui no se
    // copia a `field.options`: un copiado se quedaría congelado al primer render
    // y la página que lo llena después quedaría sin efecto.
    const list = FIELDS[this.type];
    let i = 0;
    const result: any[] = [];
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

  // --- Sedes del colegio que se esta creando -------------------------------

  addCampusName(): void {
    this.campusNames = [...this.campusNames, ''];
    this.campusNamesError = '';
  }

  removeCampusName(index: number): void {
    if (this.campusNames.length === 1) return;
    this.campusNames = this.campusNames.filter((_, i) => i !== index);
    this.campusNamesError = '';
  }

  /**
   * Nombres de sedes ya recortados, sin vacios.
   *
   * Se valida aca lo que el backend rechaza con 400/409 para que el error salga
   * junto al campo y no en un banner generico. El chequeo del backend sigue
   * mandando: el cliente puede ser cualquier cosa.
   */
  private cleanCampusNames(): { names: string[]; error: string } {
    const names = this.campusNames.map((n) => n.trim()).filter((n) => n.length > 0);

    if (names.length === 0) {
      return { names, error: this.translate.instant('register.schools.campusNamesRequired') };
    }

    const seen = new Set<string>();
    for (const name of names) {
      const key = name.toLowerCase();
      if (seen.has(key)) {
        return { names, error: this.translate.instant('register.schools.campusNamesDuplicated', { name }) };
      }
      seen.add(key);
    }

    return { names, error: '' };
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

    // Las sedes no son un campo del FIELDS sino un bloque repetible, asi que su
    // validacion vive fuera del bucle de arriba.
    if (this.type === 'schools') {
      const { names, error } = this.cleanCampusNames();
      this.campusNamesError = error;
      if (error) {
        this.validationMessage = '';
        return;
      }
      this.formData['campusNames'] = names;
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
    this.campusNames = [''];
    this.campusNamesError = '';
    for (const field of FIELDS[this.type]) {
      this.formData[field.name] = '';
    }
  }
}
