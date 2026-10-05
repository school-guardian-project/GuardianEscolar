# Ejemplo de Uso: Dropdown Selector

## Componente DropdownSelector

El componente `DropdownSelector` es un selector reutilizable que carga opciones desde el backend.

### Importar el componente

```typescript
import { DropdownSelectorComponent, DropdownOption } from '@shared/components/dropdown-selector/dropdown-selector.component';
```

### Ejemplo 1: Dropdown de Campuses

```typescript
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DropdownSelectorComponent, DropdownOption } from '@shared/components/dropdown-selector/dropdown-selector.component';
import { CampusesService } from '@core/services/campuses.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-bus-form',
  standalone: true,
  imports: [ReactiveFormsModule, DropdownSelectorComponent],
  template: `
    <app-dropdown-selector
      label="BUSES.SELECT_CAMPUS"
      [control]="campusControl"
      [loadOptions]="loadCampuses"
      (selectionChange)="onCampusSelected($event)">
    </app-dropdown-selector>
  `
})
export class BusFormComponent {
  private campusesService = inject(CampusesService);
  
  campusControl = new FormControl<string | null>(null);
  schoolId = 'school-id-from-session'; // Obtener de AuthService.session

  loadCampuses = (): Observable<DropdownOption[]> => {
    return this.campusesService.listBySchool(this.schoolId).pipe(
      map(campuses => campuses.map(c => ({ value: c.id, label: c.name })))
    );
  };

  onCampusSelected(campusId: string): void {
    console.log('Campus seleccionado:', campusId);
    // Cargar datos dependientes del campus
  }
}
```

### Ejemplo 2: Dropdowns en cascada (Brand → Model)

```typescript
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DropdownSelectorComponent, DropdownOption } from '@shared/components/dropdown-selector/dropdown-selector.component';
import { VehicleTypesService } from '@core/services/vehicle-types.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [ReactiveFormsModule, DropdownSelectorComponent],
  template: `
    <app-dropdown-selector
      label="VEHICLES.SELECT_BRAND"
      [control]="brandControl"
      [loadOptions]="loadBrands"
      (selectionChange)="onBrandSelected($event)">
    </app-dropdown-selector>

    <app-dropdown-selector
      *ngIf="selectedBrandId"
      label="VEHICLES.SELECT_MODEL"
      [control]="modelControl"
      [loadOptions]="loadModels"
      (selectionChange)="onModelSelected($event)">
    </app-dropdown-selector>
  `
})
export class VehicleFormComponent {
  private vehicleTypesService = inject(VehicleTypesService);
  
  brandControl = new FormControl<number | null>(null);
  modelControl = new FormControl<number | null>(null);
  selectedBrandId: number | null = null;

  loadBrands = (): Observable<DropdownOption[]> => {
    return this.vehicleTypesService.listBrands().pipe(
      map(brands => brands.map(b => ({ value: b.id, label: b.name })))
    );
  };

  loadModels = (): Observable<DropdownOption[]> => {
    if (!this.selectedBrandId) return of([]);
    return this.vehicleTypesService.listModels(this.selectedBrandId).pipe(
      map(models => models.map(m => ({ value: m.id, label: m.name })))
    );
  };

  onBrandSelected(brandId: number): void {
    this.selectedBrandId = brandId;
    this.modelControl.reset(); // Resetear modelo cuando cambia la marca
  }

  onModelSelected(modelId: number): void {
    console.log('Modelo seleccionado:', modelId);
  }
}
```

### Ejemplo 3: Integración en formulario de buses

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DropdownSelectorComponent, DropdownOption } from '@shared/components/dropdown-selector/dropdown-selector.component';
import { CampusesService } from '@core/services/campuses.service';
import { VehicleTypesService } from '@core/services/vehicle-types.service';
import { BusesService } from '@core/services/buses.service';
import { AuthService } from '@core/services/auth.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-bus-form',
  standalone: true,
  imports: [ReactiveFormsModule, DropdownSelectorComponent],
  template: `
    <form [formGroup]="busForm" (ngSubmit)="onSubmit()">
      <app-dropdown-selector
        label="BUSES.CAMPUS"
        [control]="campusControl"
        [loadOptions]="loadCampuses"
        [required]="true">
      </app-dropdown-selector>

      <app-dropdown-selector
        label="BUSES.BRAND"
        [control]="brandControl"
        [loadOptions]="loadBrands"
        (selectionChange)="onBrandSelected($event)"
        [required]="true">
      </app-dropdown-selector>

      <app-dropdown-selector
        *ngIf="selectedBrandId"
        label="BUSES.MODEL"
        [control]="modelControl"
        [loadOptions]="loadModels"
        [required]="true">
      </app-dropdown-selector>

      <!-- Otros campos del formulario -->
      <input formControlName="plate" placeholder="Placa" />
      <input formControlName="capacity" type="number" placeholder="Capacidad" />
      
      <button type="submit">Guardar</button>
    </form>
  `
})
export class BusFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private campusesService = inject(CampusesService);
  private vehicleTypesService = inject(VehicleTypesService);
  private busesService = inject(BusesService);
  private authService = inject(AuthService);

  busForm!: FormGroup;
  selectedBrandId: number | null = null;

  // Controles reactivos para los dropdowns
  get campusControl() { return this.busForm.get('campusId') as FormControl; }
  get brandControl() { return this.busForm.get('brandId') as FormControl; }
  get modelControl() { return this.busForm.get('modelId') as FormControl; }

  ngOnInit(): void {
    this.busForm = this.fb.group({
      campusId: ['', Validators.required],
      brandId: [null, Validators.required],
      modelId: [null, Validators.required],
      plate: ['', [Validators.required, Validators.maxLength(10)]],
      capacity: [0, [Validators.required, Validators.min(1)]]
    });
  }

  loadCampuses = (): Observable<DropdownOption[]> => {
    const schoolId = this.authService.session.schoolId;
    if (!schoolId) return of([]);
    
    return this.campusesService.listBySchool(schoolId).pipe(
      map(campuses => campuses.map(c => ({ value: c.id, label: c.name })))
    );
  };

  loadBrands = (): Observable<DropdownOption[]> => {
    return this.vehicleTypesService.listBrands().pipe(
      map(brands => brands.map(b => ({ value: b.id, label: b.name })))
    );
  };

  loadModels = (): Observable<DropdownOption[]> => {
    if (!this.selectedBrandId) return of([]);
    
    return this.vehicleTypesService.listModels(this.selectedBrandId).pipe(
      map(models => models.map(m => ({ value: m.id, label: m.name })))
    );
  };

  onBrandSelected(brandId: number): void {
    this.selectedBrandId = brandId;
    this.modelControl.reset(); // Resetear modelo cuando cambia la marca
  }

  onSubmit(): void {
    if (this.busForm.invalid) return;

    const formValue = this.busForm.value;
    const busData = {
      campuseId: formValue.campusId,
      modelId: formValue.modelId,
      plate: formValue.plate,
      capacity: formValue.capacity,
      // ... otros campos
    };

    this.busesService.create(busData).subscribe(() => {
      console.log('Bus creado exitosamente');
    });
  }
}
```

## API de DropdownSelector

### Inputs

| Input | Tipo | Descripción |
|-------|------|-------------|
| `label` | `string` | Etiqueta del dropdown (soporta traducciones) |
| `hint` | `string` | Texto de ayuda (opcional) |
| `control` | `FormControl` | Control reactivo del formulario |
| `loadOptions` | `() => Observable<DropdownOption[]>` | Función que carga las opciones |
| `required` | `boolean` | Indica si el campo es requerido |

### Outputs

| Output | Tipo | Descripción |
|--------|------|-------------|
| `selectionChange` | `EventEmitter<string \| number>` | Emite cuando se selecciona una opción |
| `optionsLoaded` | `EventEmitter<DropdownOption[]>` | Emite cuando las opciones se cargan |

### Interfaz DropdownOption

```typescript
interface DropdownOption {
  value: string | number;
  label: string;
}
```

## Endpoints Backend Disponibles

### Campuses
```
GET /school-management/api/v1/schools/{schoolId}/campuses
```

**Respuesta:**
```json
[
  { "id": "uuid", "name": "Campus Norte", "address": "Calle 123" },
  { "id": "uuid", "name": "Campus Sur", "address": "Avenida 456" }
]
```

### Brands
```
GET /fleet/api/vehicle-types/brands
```

**Respuesta:**
```json
[
  { "id": 1, "name": "Toyota" },
  { "id": 2, "name": "Mercedes-Benz" }
]
```

### Models
```
GET /fleet/api/vehicle-types/models?brandId=1
```

**Respuesta:**
```json
[
  { "id": 1, "name": "Corolla", "brandId": 1, "brandName": "Toyota" },
  { "id": 2, "name": "Hilux", "brandId": 1, "brandName": "Toyota" }
]
```

## Patrones Recomendados

### 1. Carga perezosa
Solo carga los dropdowns cuando sean necesarios (ej: dropdowns en cascada).

### 2. Manejo de errores
El componente ya maneja errores internamente, pero puedes personalizar el manejo:

```typescript
loadOptions = (): Observable<DropdownOption[]> => {
  return this.service.getData().pipe(
    map(data => data.map(d => ({ value: d.id, label: d.name }))),
    catchError(err => {
      this.showError('Error al cargar opciones');
      return of([]);
    })
  );
};
```

### 3. Validación
Usa validadores de Angular para campos requeridos:

```typescript
campusControl = new FormControl(null, Validators.required);
```

### 4. Valores por defecto
Puedes establecer valores por defecto:

```typescript
ngOnInit(): void {
  this.campusControl.setValue('default-campus-id');
}
```

## Testing

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownSelectorComponent } from './dropdown-selector.component';
import { of } from 'rxjs';

describe('DropdownSelectorComponent', () => {
  let component: DropdownSelectorComponent;
  let fixture: ComponentFixture<DropdownSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownSelectorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownSelectorComponent);
    component = fixture.componentInstance;
  });

  it('should load options on init', () => {
    const mockOptions = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' }
    ];
    
    component.loadOptions = () => of(mockOptions);
    fixture.detectChanges();

    expect(component.options).toEqual(mockOptions);
  });
});
```
