# Plan de Integración Backend-Frontend | School Guardian

## 1. Diagnóstico del Estado Actual

### 1.1 Arquitectura de Microservicios (school-guardian/backend/*)

```
┌─────────────────────────────────────────────────────────────────┐
│                        API GATEWAY (Kong)                        │
│                         Puerto: 8000                             │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│   ms-iam     │    │ ms-user-mgmt     │    │  ms-fleet    │
│ (Spring Boot)│    │    (.NET)        │    │   (.NET)     │
│ :8080        │    │    :8080         │    │   :8080      │
└──────────────┘    └──────────────────┘    └──────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│  ms-route    │    │ ms-school-mgmt   │    │ms-notification│
│   (.NET)     │    │    (.NET)        │    │   (.NET)     │
│   :8080      │    │    :8080         │    │   :8080      │
└──────────────┘    └──────────────────┘    └──────────────┘
```

### 1.2 Routing del API Gateway (Kong)

| Ruta Gateway | Microservicio Destino | Strip Path | Ruta Final |
|--------------|----------------------|------------|------------|
| `/api/v1/auth/*` | ms-iam:8080 | false | `/api/v1/auth/*` |
| `/user/*` | ms-user-management:8080 | true | `/api/students`, `/api/drivers`, etc. |
| `/fleet/*` | ms-fleet:8080 | true | `/api/buses` |
| `/route/*` | ms-route:8080 | true | `/api/routes`, `/api/stops`, `/api/cities` |
| `/school-management/*` | ms-school-management:8080 | true | `/api/v1/schools` |
| `/notification/*` | ms-notification:8080 | true | `/api/notifications` |

### 1.3 Endpoints Backend Existentes

#### ms-iam (Java/Spring Boot)
```
POST /api/v1/auth/login          → LoginResponseDto (accessToken, profileId, personId, email, roleId, campusId)
POST /api/v1/auth/refresh        → RefreshResponseDto (accessToken)
POST /api/v1/auth/logout         → 204 No Content
```

#### ms-user-management (.NET)
```
GET/POST/PUT/DELETE /api/students[/{id}]
GET/POST/PUT/DELETE /api/drivers[/{id}]
GET/POST/PUT/DELETE /api/parents[/{id}]
GET/POST/PUT/DELETE /api/families[/{id}]
GET/POST/PUT/DELETE /api/admins[/{id}]
GET /api/students/search?search=
GET /api/drivers/search?search=
GET /api/parents/search?search=
GET /api/families/search?search=
```

#### ms-fleet (.NET)
```
GET/POST/PUT/DELETE /api/buses[/{id}]
GET /api/buses/search?search=
PUT /api/buses/{id}/driver
DELETE /api/buses/{id}/driver
PATCH /api/buses/{id}/status
```

#### ms-route (.NET)
```
GET/POST/PUT/DELETE /api/routes[/{id}]
GET/POST/PUT/DELETE /api/stops[/{id}]
GET /api/cities
GET /api/routes/search?search=
GET /api/stops/search?search=
POST /api/routes/{routeId}/stops
POST /api/routes/{routeId}/students
PUT /api/routes/{routeId}/bus
GET /api/routes/{routeId}/students/{studentProfileId}
```

#### ms-school-management (.NET)
```
GET/POST/PUT/DELETE /api/v1/schools[/{id}]
GET /api/v1/schools/search?search=
```

### 1.4 Frontend Web (Angular 21) - Servicios Existentes

```typescript
// auth.service.ts
POST ${apiUrl}/api/v1/auth/login
POST ${apiUrl}/api/v1/auth/refresh
POST ${apiUrl}/api/v1/auth/logout

// buses.service.ts
GET/POST/PUT/DELETE ${apiUrl}/fleet/api/buses[/{id}]
GET ${apiUrl}/fleet/api/buses/search?search=
PUT ${apiUrl}/fleet/api/buses/{busId}/driver
DELETE ${apiUrl}/fleet/api/buses/{busId}/driver

// routes.service.ts
GET/POST/PUT/DELETE ${apiUrl}/route/api/routes[/{id}]
GET ${apiUrl}/route/api/routes/search?search=
POST ${apiUrl}/route/api/routes/{routeId}/stops
POST ${apiUrl}/route/api/routes/{routeId}/students
PUT ${apiUrl}/route/api/routes/{routeId}/bus
GET ${apiUrl}/route/api/routes/student/{studentProfileId}
GET ${apiUrl}/route/api/routes/{routeId}/students/{studentProfileId}

// stops.service.ts
GET/POST/PUT/DELETE ${apiUrl}/route/api/stops[/{id}]
GET ${apiUrl}/route/api/stops/search?search=

// cities.service.ts
GET ${apiUrl}/route/api/cities

// students.service.ts
GET/POST/PUT/DELETE ${apiUrl}/user/api/students[/{id}]
GET ${apiUrl}/user/api/students/search?search=

// drivers.service.ts
GET/POST/PUT/DELETE ${apiUrl}/user/api/drivers[/{id}]
GET ${apiUrl}/user/api/drivers/search?search=

// parents.service.ts
GET/POST/PUT/DELETE ${apiUrl}/user/api/parents[/{id}]
GET ${apiUrl}/user/api/parents/search?search=

// families.service.ts
GET/POST/PUT/DELETE ${apiUrl}/user/api/families[/{id}]
GET ${apiUrl}/user/api/families/search?search=

// schools.service.ts
GET/POST/PUT/DELETE ${apiUrl}/school-management/api/v1/schools[/{id}]
GET ${apiUrl}/school-management/api/v1/schools/search?search=
```

---

## 2. Bugs e Inconsistencias Detectadas

### 2.1 CRÍTICO: Auth Interceptor no envía token a endpoints de negocio

**Archivo:** `dvlp-front/dvlp-web/src/app/core/services/auth.interceptor.ts`

**Problema:**
```typescript
// CÓDIGO ACTUAL (INCORRECTO)
if (req.url.includes('/api/v1/auth/')) {
    const token = auth.getToken();
    return next(token ? withBearer(req, token) : req);
}
// Después de este if, el token NUNCA se agrega a otras requests
```

**Impacto:** Todas las requests a microservicios de negocio van SIN token de autenticación.

**Solución:**
```typescript
// CÓDIGO CORRECTO
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  // No agregar token a endpoints de auth (login/refresh)
  if (req.url.includes('/api/v1/auth/login') || req.url.includes('/api/v1/auth/refresh')) {
    return next(req);
  }

  let retried = false;
  const send = (token: string | null) => next(token ? withBearer(req, token) : req);

  return send(auth.getToken()).pipe(
    catchError((error: unknown) => {
      const expired = error instanceof HttpErrorResponse && error.status === 401;
      if (!expired || retried) {
        return throwError(() => error);
      }
      retried = true;
      return auth.refresh().pipe(switchMap((token) => send(token)));
    }),
  );
};
```

### 2.2 CRÍTICO: Falta endpoint de perfil de usuario

**Problema:** El frontend necesita mostrar datos del usuario logueado (nombre, email, rol, campus) pero no existe endpoint para obtener el perfil completo.

**Solución:** Agregar endpoint en ms-iam:
```
GET /api/v1/auth/profile → UserProfileDto
```

### 2.3 CRÍTICO: Falta endpoint de cambio de contraseña

**Problema:** El frontend tiene componentes de cambio de contraseña (`features/profile/pages/change-password/`) pero no hay endpoint backend.

**Solución:** Agregar endpoint en ms-iam:
```
POST /api/v1/auth/change-password
```

### 2.4 MEDIO: Falta campusId en sesión del frontend

**Problema:** El backend devuelve `campusId` en LoginResponseDto pero el frontend no lo almacena.

**Archivo:** `dvlp-front/dvlp-web/src/app/core/services/auth.service.ts`

**Solución:** Agregar `campusId` a la interfaz `Session` y al método `applySession`.

### 2.5 MEDIO: Inconsistencia en nombres de campos

| Frontend (Angular) | Backend (.NET) | Problema |
|-------------------|----------------|----------|
| `campuseId` | `CampuseId` | Typo: debería ser `campusId` |
| `soatValidity` (string) | `SoatValidity` (DateTime) | Tipo incompatible |
| `gpsDeviceId` (string) | `GpsDeviceId` (Guid) | Formato diferente |

### 2.6 BAJO: Faltan endpoints de búsqueda en algunos servicios

- `ms-school-management`: Falta endpoint de búsqueda de campuses
- `ms-fleet`: Faltan endpoints de marcas y modelos de buses (para dropdowns)

---

## 3. Plan de Implementación

### Fase 1: Correcciones Críticas de Seguridad (Semana 1)

#### 3.1.1 Corregir Auth Interceptor (Frontend Web)

**Archivo:** `dvlp-front/dvlp-web/src/app/core/services/auth.interceptor.ts`

```typescript
import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

function withBearer(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  // Endpoints públicos que NO requieren token
  const publicEndpoints = ['/api/v1/auth/login', '/api/v1/auth/refresh'];
  if (publicEndpoints.some(ep => req.url.includes(ep))) {
    return next(req);
  }

  let retried = false;
  const send = (token: string | null) => next(token ? withBearer(req, token) : req);

  return send(auth.getToken()).pipe(
    catchError((error: unknown) => {
      const expired = error instanceof HttpErrorResponse && error.status === 401;
      if (!expired || retried) {
        return throwError(() => error);
      }
      retried = true;
      return auth.refresh().pipe(switchMap((token) => send(token)));
    }),
  );
};
```

#### 3.1.2 Agregar endpoint de perfil en ms-iam

**Archivo:** `ms-iam/src/main/java/com/school_guardian/ms_iam/infrastructure/web/AuthController.java`

```java
@GetMapping("/profile")
@Operation(summary = "Get current user profile", description = "Returns complete profile data for the authenticated user")
public ResponseEntity<UserProfileDto> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
    // Obtener profileId del token
    String profileId = extractProfileIdFromToken();
    UserProfileDto profile = profileService.getProfile(profileId);
    return ResponseEntity.ok(profile);
}
```

**DTO de respuesta:**
```java
public record UserProfileDto(
    String profileId,
    String personId,
    String email,
    String name,
    String lastName,
    Integer roleId,
    String roleName,
    String campusId,
    String campusName,
    String schoolId,
    String schoolName,
    String phone,
    String identificationNumber
) {}
```

#### 3.1.3 Agregar endpoint de cambio de contraseña en ms-iam

```java
@PostMapping("/change-password")
@Operation(summary = "Change user password")
public ResponseEntity<Void> changePassword(
    @Valid @RequestBody ChangePasswordRequest request,
    @AuthenticationPrincipal UserDetails userDetails
) {
    String profileId = extractProfileIdFromToken();
    changePasswordService.execute(profileId, request.currentPassword(), request.newPassword());
    return ResponseEntity.noContent().build();
}

public record ChangePasswordRequest(
    @NotBlank String currentPassword,
    @NotBlank @Size(min = 8) String newPassword
) {}
```

#### 3.1.4 Actualizar Session en frontend para incluir campusId

**Archivo:** `dvlp-front/dvlp-web/src/app/core/services/auth.service.ts`

```typescript
export interface Session {
  profileId: string | null;
  personId: string | null;
  email: string | null;
  campusId: string | null;  // AGREGAR
  schoolId: string | null;  // AGREGAR
}

// Actualizar LoginResponse interface
interface LoginResponse {
  accessToken: string;
  profileId: string;
  personId: string;
  email: string;
  roleId: number | null;
  campusId: string;  // AGREGAR
}

// Actualizar applySession
private applySession(res: Partial<LoginResponse>): void {
  const claims = this.claims();
  const pick = (key: keyof Session): string | null => {
    const fromRes = res[key];
    if (typeof fromRes === 'string' && fromRes) return fromRes;
    const fromClaims = claims[key];
    return typeof fromClaims === 'string' && fromClaims ? fromClaims : this.userSession[key];
  };
  this.userSession = {
    profileId: pick('profileId'),
    personId: pick('personId'),
    email: pick('email'),
    campusId: pick('campusId'),
    schoolId: pick('schoolId')
  };
}
```

### Fase 2: Endpoints para Dropdowns y Selectores (Semana 2)

#### 3.2.1 Endpoint de campuses por escuela en ms-school-management

**Controlador:** `CampusController.java`

```csharp
[ApiController]
[Route("api/v1/schools/{schoolId}/campuses")]
public sealed class CampusController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> ListBySchool(Guid schoolId)
    {
        var campuses = await _campusService.ListBySchoolAsync(schoolId);
        return Ok(campuses);
    }
}
```

**DTO:**
```csharp
public record CampusListDto(Guid Id, string Name, string Address);
```

#### 3.2.2 Endpoint de marcas y modelos de buses en ms-fleet

**Controlador:** `VehicleTypeController.cs`

```csharp
[ApiController]
[Route("api/vehicle-types")]
public class VehicleTypeController : ControllerBase
{
    [HttpGet("brands")]
    public async Task<IActionResult> ListBrands()
    {
        var brands = await _brandService.ListAsync();
        return Ok(brands);
    }

    [HttpGet("models")]
    public async Task<IActionResult> ListModels([FromQuery] int? brandId)
    {
        var models = await _modelService.ListAsync(brandId);
        return Ok(models);
    }
}
```

**DTOs:**
```csharp
public record BrandDto(int Id, string Name);
public record ModelDto(int Id, string Name, int BrandId, string BrandName);
```

#### 3.2.3 Endpoint de dispositivos GPS disponibles en ms-fleet

```csharp
[HttpGet("gps-devices/available")]
public async Task<IActionResult> ListAvailableGpsDevices()
{
    var devices = await _gpsDeviceService.ListAvailableAsync();
    return Ok(devices);
}

public record GpsDeviceDto(Guid Id, string Imei, string Description);
```

#### 3.2.4 Servicios frontend para dropdowns

**Archivo:** `dvlp-front/dvlp-web/src/app/core/services/campuses.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CampusListDto {
  id: string;
  name: string;
  address: string;
}

@Injectable({ providedIn: 'root' })
export class CampusesService {
  private readonly base = `${environment.apiUrl}/school-management/api/v1`;

  constructor(private http: HttpClient) {}

  listBySchool(schoolId: string): Observable<CampusListDto[]> {
    return this.http.get<CampusListDto[]>(`${this.base}/schools/${schoolId}/campuses`);
  }
}
```

**Archivo:** `dvlp-front/dvlp-web/src/app/core/services/vehicle-types.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface BrandDto {
  id: number;
  name: string;
}

export interface ModelDto {
  id: number;
  name: string;
  brandId: number;
  brandName: string;
}

@Injectable({ providedIn: 'root' })
export class VehicleTypesService {
  private readonly base = `${environment.apiUrl}/fleet/api/vehicle-types`;

  constructor(private http: HttpClient) {}

  listBrands(): Observable<BrandDto[]> {
    return this.http.get<BrandDto[]>(`${this.base}/brands`);
  }

  listModels(brandId?: number): Observable<ModelDto[]> {
    const params = brandId ? { brandId: brandId.toString() } : {};
    return this.http.get<ModelDto[]>(`${this.base}/models`, { params });
  }
}
```

### Fase 3: Componente de Perfil de Usuario (Semana 2-3)

#### 3.3.1 Servicio de perfil en frontend

**Archivo:** `dvlp-front/dvlp-web/src/app/core/services/profile.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserProfileDto {
  profileId: string;
  personId: string;
  email: string;
  name: string;
  lastName: string;
  roleId: number;
  roleName: string;
  campusId: string | null;
  campusName: string | null;
  schoolId: string | null;
  schoolName: string | null;
  phone: string;
  identificationNumber: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly base = `${environment.apiUrl}/api/v1/auth`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserProfileDto> {
    return this.http.get<UserProfileDto>(`${this.base}/profile`);
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.base}/change-password`, request);
  }

  updateEmail(newEmail: string): Observable<void> {
    return this.http.post<void>(`${this.base}/change-email`, { email: newEmail });
  }
}
```

#### 3.3.2 Componente de perfil

**Archivo:** `dvlp-front/dvlp-web/src/app/features/profile/pages/view-profile/view-profile.ts`

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileService, UserProfileDto } from '../../../../core/services/profile.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './view-profile.html',
  styleUrls: ['./view-profile.scss']
})
export class ViewProfile implements OnInit {
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);

  profile: UserProfileDto | null = null;
  loading = true;

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.loading = false;
      }
    });
  }

  get fullName(): string {
    return this.profile ? `${this.profile.name} ${this.profile.lastName}` : '';
  }

  get roleLabel(): string {
    if (!this.profile) return '';
    const roleMap: Record<number, string> = {
      1: 'Admin',
      2: 'Student',
      3: 'Driver',
      4: 'Parent',
      5: 'Super Admin'
    };
    return roleMap[this.profile.roleId] || this.profile.roleName;
  }
}
```

### Fase 4: Estrategia de Ramas Git (Continuo)

#### 3.4.1 Convenciones de Naming

```
main                                    ← Producción (protegida, requiere PR)
develop                                 ← Integración continua (protegida, requiere PR)
feature/<descripcion-corta>             ← Nuevas funcionalidades
fix/<descripcion-corta>                 ← Corrección de bugs
hotfix/<descripcion-corta>              ← Parches urgentes a producción
refactor/<descripcion-corta>            ← Refactorización sin cambio funcional
docs/<descripcion-corta>                ← Solo documentación
```

**Ejemplos:**
```
feature/user-profile-endpoint
feature/dropdown-campuses
fix/auth-interceptor-token
fix/bus-form-validation
refactor/extract-base-service
docs/integration-plan
```

#### 3.4.2 Flujo de Trabajo

```
1. Crear rama desde develop:
   git checkout develop
   git pull origin develop
   git checkout -b feature/nueva-funcionalidad

2. Desarrollar y commitear:
   git add .
   git commit -m "feat(auth): add user profile endpoint"

3. Push y crear PR:
   git push origin feature/nueva-funcionalidad
   # Crear Pull Request en GitHub

4. Code review y merge a develop:
   # Después de aprobación, merge via GitHub

5. Release a producción:
   git checkout main
   git merge develop
   git tag v1.2.0
   git push origin main --tags
```

#### 3.4.3 Convención de Commits (Conventional Commits)

```
feat(auth): add user profile endpoint
fix(interceptor): send token to business endpoints
docs(api): update integration plan
refactor(service): extract base CRUD service
test(bus): add unit tests for bus service
chore(deps): update angular to 21.2.9
```

### Fase 5: Seguridad en Endpoints (Semana 3)

#### 3.5.1 Validación de JWT en microservicios .NET

**Archivo:** `ms-user-management/Program.cs`

```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "http://ms-iam:8080";
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = "school-guardian-iam",
            ValidateAudience = true,
            ValidAudience = "school-guardian-api",
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!))
        };
    });

builder.Services.AddAuthorization();

// En el middleware pipeline
app.UseAuthentication();
app.UseAuthorization();
```

#### 3.5.2 Autorización por roles

```csharp
[ApiController]
[Route("api/students")]
[Authorize]
public class StudentController : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> Create([FromBody] PersonRequestDto dto)
    {
        // Solo Admin y SuperAdmin pueden crear estudiantes
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll()
    {
        // Cualquier usuario autenticado puede listar
    }
}
```

#### 3.5.3 Validación en Frontend

**Archivo:** `dvlp-front/dvlp-web/src/app/core/interceptors/error.interceptor.ts`

```typescript
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          // Token inválido o expirado
          authService.logout().subscribe(() => {
            router.navigate(['/login']);
          });
          break;
        case 403:
          // Sin permisos
          console.error('Forbidden: insufficient permissions');
          router.navigate(['/unauthorized']);
          break;
        case 404:
          console.error('Resource not found:', req.url);
          break;
        case 500:
          console.error('Server error:', error.error);
          break;
      }
      return throwError(() => error);
    })
  );
};
```

### Fase 6: Código Reutilizable (Semana 3-4)

#### 3.6.1 Servicio CRUD base (Frontend)

**Archivo:** `dvlp-front/dvlp-web/src/app/core/services/abstract-crud.service.ts`

```typescript
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export abstract class AbstractCrudService<TListDto, TRequestDto, TResponseDto extends TListDto> {
  protected abstract baseUrl: string;

  constructor(protected http: HttpClient) {}

  list(): Observable<TListDto[]> {
    return this.http.get<TListDto[]>(this.baseUrl);
  }

  search(term: string): Observable<TListDto[]> {
    return this.http.get<TListDto[]>(`${this.baseUrl}/search?search=${encodeURIComponent(term)}`);
  }

  get(id: string): Observable<TResponseDto> {
    return this.http.get<TResponseDto>(`${this.baseUrl}/${id}`);
  }

  create(payload: TRequestDto): Observable<void> {
    return this.http.post<void>(this.baseUrl, payload);
  }

  update(id: string, payload: TRequestDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
```

**Uso:**
```typescript
@Injectable({ providedIn: 'root' })
export class BusesService extends AbstractCrudService<BusListDto, BusRequestDto, BusResponseDto> {
  protected baseUrl = `${environment.apiUrl}/fleet/api/buses`;

  constructor(http: HttpClient) {
    super(http);
  }

  // Métodos específicos del servicio
  assignDriver(busId: string, profileId: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${busId}/driver`, { profileId });
  }

  unassignDriver(busId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${busId}/driver`);
  }
}
```

#### 3.6.2 Componente de selector reutilizable

**Archivo:** `dvlp-front/dvlp-web/src/app/shared/components/dropdown-selector/dropdown-selector.ts`

```typescript
import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

export interface DropdownOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-dropdown-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, MatFormFieldModule, MatSelectModule],
  template: `
    <mat-form-field appearance="outline" class="w-full">
      <mat-label>{{ label | translate }}</mat-label>
      <mat-select [formControl]="control" (selectionChange)="onSelect($event.value)">
        <mat-option *ngFor="let option of options$ | async" [value]="option.value">
          {{ option.label }}
        </mat-option>
      </mat-select>
      <mat-hint *ngIf="hint">{{ hint | translate }}</mat-hint>
    </mat-form-field>
  `
})
export class DropdownSelector implements OnInit {
  @Input() label = '';
  @Input() hint = '';
  @Input() control = new FormControl<string | null>(null);
  @Input() loadOptions: () => Observable<DropdownOption[]> = () => of([]);
  @Input() searchable = false;
  @Output() selectionChange = new EventEmitter<string>();

  options$: Observable<DropdownOption[]> = of([]);

  ngOnInit(): void {
    this.options$ = this.loadOptions();
  }

  onSelect(value: string): void {
    this.selectionChange.emit(value);
  }
}
```

**Uso:**
```typescript
// En un componente padre
<app-dropdown-selector
  label="BUSES.SELECT_CAMPUS"
  [control]="campusControl"
  [loadOptions]="loadCampuses"
  (selectionChange)="onCampusSelected($event)">
</app-dropdown-selector>

// En el component.ts
campusControl = new FormControl<string | null>(null);

loadCampuses = (): Observable<DropdownOption[]> => {
  return this.campusesService.listBySchool(this.schoolId).pipe(
    map(campuses => campuses.map(c => ({ value: c.id, label: c.name })))
  );
};

onCampusSelected(campusId: string): void {
  this.selectedCampusId = campusId;
  // Cargar datos dependientes
}
```

#### 3.6.3 Helper de validación de formularios

**Archivo:** `dvlp-front/dvlp-web/src/app/core/validators/form-validators.ts`

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class FormValidators {
  static email(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value) ? null : { email: 'Invalid email format' };
  }

  static phone(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(value) ? null : { phone: 'Invalid phone number' };
  }

  static identificationNumber(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const idRegex = /^[0-9]{6,15}$/;
    return idRegex.test(value) ? null : { identificationNumber: 'Invalid identification number' };
  }

  static passwordStrength(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const hasMinLength = value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    
    const valid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber;
    return valid ? null : { passwordStrength: 'Password must contain at least 8 characters, uppercase, lowercase, and number' };
  }

  static passwordMatch(matchControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const matchControl = control.parent?.get(matchControlName);
      if (!matchControl) return null;
      
      return control.value === matchControl.value ? null : { passwordMatch: 'Passwords do not match' };
    };
  }
}
```

---

## 4. Orden Lógico de Implementación

### Semana 1: Fundamentos de Seguridad
1. ✅ Corregir auth interceptor (frontend)
2. ✅ Agregar endpoint GET /api/v1/auth/profile (ms-iam)
3. ✅ Agregar endpoint POST /api/v1/auth/change-password (ms-iam)
4. ✅ Actualizar Session en frontend para incluir campusId
5. ✅ Crear componente de perfil de usuario (frontend)

### Semana 2: Dropdowns y Selectores
1. ✅ Agregar endpoint de campuses por escuela (ms-school-management)
2. ✅ Agregar endpoint de marcas/modelos de buses (ms-fleet)
3. ✅ Agregar endpoint de dispositivos GPS disponibles (ms-fleet)
4. ✅ Crear servicios frontend para dropdowns
5. ✅ Crear componente dropdown-selector reutilizable
6. ✅ Integrar dropdowns en formularios existentes

### Semana 3: Seguridad y Validación
1. ✅ Configurar validación JWT en microservicios .NET
2. ✅ Agregar autorización por roles en controllers
3. ✅ Crear error interceptor en frontend
4. ✅ Implementar validadores de formularios
5. ✅ Agregar guards de ruta por rol

### Semana 4: Código Reutilizable y Refactor
1. ✅ Crear abstract-crud.service base
2. ✅ Refactorizar servicios existentes para heredar de base
3. ✅ Crear componentes reutilizables (dropdown, search-bar, data-table)
4. ✅ Documentar patrones y convenciones
5. ✅ Escribir tests unitarios para servicios críticos

### Semana 5: Integración Mobile
1. ✅ Configurar auth en React Native (Expo)
2. ✅ Implementar secure storage para tokens
3. ✅ Crear servicios HTTP base
4. ✅ Implementar pantallas de login y perfil
5. ✅ Integrar push notifications

---

## 5. Convenciones para Web y Mobile

### 5.1 Frontend Web (Angular)

```typescript
// Estructura de archivos
features/
  admin/
    users/
      pages/
        students/
          students.ts           // Componente
          students.html         // Template
          students.scss         // Estilos
          students.routes.ts    // Rutas hijas
          students.spec.ts      // Tests

// Naming
- Componentes: PascalCase (StudentListComponent)
- Servicios: camelCase (studentsService)
- Interfaces: PascalCase + Dto suffix (StudentListDto)
- Variables: camelCase
- Constantes: UPPER_SNAKE_CASE

// Imports
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
```

### 5.2 Frontend Mobile (React Native / Expo)

```typescript
// Estructura de archivos
src/
  features/
    auth/
      screens/
        LoginScreen.tsx
        ForgotPasswordScreen.tsx
      services/
        authService.ts
      hooks/
        useAuth.ts
      types/
        auth.types.ts
  shared/
    components/
      Button.tsx
      Input.tsx
    hooks/
      useApi.ts
    utils/
      storage.ts

// Naming
- Componentes: PascalCase (LoginScreen)
- Hooks: camelCase + use prefix (useAuth)
- Servicios: camelCase (authService)
- Tipos: PascalCase (User)
- Archivos: PascalCase para componentes, camelCase para resto

// Imports
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
```

### 5.3 Backend (.NET)

```csharp
// Estructura
src/
  ms-{module}.Api/
    {Entity}/
      Application/
        Dto/
          {Entity}Dtos.cs
        UseCase/
          Create{Entity}Service.cs
          Get{Entity}Service.cs
          List{Entity}Service.cs
          Update{Entity}Service.cs
          Delete{Entity}Service.cs
      Domain/
        Model/
          {Entity}.cs
        Ports/
          In/
            ICreate{Entity}UseCase.cs
            IGet{Entity}UseCase.cs
          Out/
            I{Entity}Repository.cs
      Infrastructure/
        Controller/
          {Entity}Controller.cs
        Mapper/
          {Entity}Mapper.cs
        Repository/
          {Entity}Repository.cs

// Naming
- Controllers: PascalCase + Controller suffix (StudentController)
- Services: PascalCase + Service suffix (CreateStudentService)
- DTOs: PascalCase + Dto suffix (StudentListDto)
- Interfaces: I + PascalCase + UseCase/Repository suffix (ICreateStudentUseCase)
- Methods: PascalCase (ExecuteAsync, GetByIdAsync)
- Properties: PascalCase (FirstName, LastName)
```

### 5.4 Backend (Java/Spring Boot)

```java
// Estructura
src/main/java/com/school_guardian/ms_{module}/
  application/
    dto/
      {Entity}Dtos.java
    usecase/
      Create{Entity}Service.java
      Get{Entity}Service.java
  domain/
    model/
      {Entity}.java
    port/
      in/
        Create{Entity}UseCase.java
      out/
        {Entity}Repository.java
  infrastructure/
    web/
      {Entity}Controller.java
    config/
      {Module}Config.java
    repository/
      {Entity}RepositoryImpl.java

// Naming
- Controllers: PascalCase + Controller suffix (AuthController)
- Services: PascalCase + Service suffix (LoginService)
- DTOs: PascalCase + Dto suffix (LoginRequestDto)
- UseCases: PascalCase + UseCase suffix (LoginUseCase)
- Methods: camelCase (execute, getById)
- Fields: camelCase (firstName, lastName)
```

---

## 6. Checklist de Verificación

### Seguridad
- [ ] Auth interceptor envía token a todos los endpoints protegidos
- [ ] Refresh token funciona correctamente (web con cookies, mobile con header)
- [ ] Logout invalida token en backend
- [ ] Endpoints validan JWT en todos los microservicios
- [ ] Autorización por roles implementada
- [ ] CORS configurado correctamente en Kong
- [ ] Rate limiting activo en endpoints críticos

### Funcionalidad
- [ ] Login funciona y devuelve todos los datos de sesión
- [ ] Perfil de usuario se muestra correctamente
- [ ] Cambio de contraseña funciona
- [ ] Dropdowns cargan datos desde backend
- [ ] CRUD de entidades funciona (students, drivers, buses, routes, stops)
- [ ] Búsqueda funciona en todas las entidades
- [ ] Asignaciones funcionan (bus-driver, route-bus, route-student)

### Código
- [ ] Servicios frontend heredan de abstract-crud.service
- [ ] Componentes reutilizables creados (dropdown, search-bar)
- [ ] Validadores de formularios implementados
- [ ] Error handling centralizado
- [ ] Tests unitarios para servicios críticos
- [ ] Documentación actualizada

### Git
- [ ] Ramas siguen convención de naming
- [ ] Commits siguen Conventional Commits
- [ ] PRs requieren code review
- [ ] main y develop protegidas
- [ ] Tags semánticos para releases

---

## 7. Próximos Pasos Inmediatos

1. **Corregir auth interceptor** (CRÍTICO - bloquea toda la integración)
2. **Agregar endpoint de perfil** en ms-iam
3. **Agregar endpoint de cambio de contraseña** en ms-iam
4. **Probar flujo completo**: login → obtener perfil → mostrar datos
5. **Implementar dropdowns** para campuses, brands, models
6. **Configurar validación JWT** en microservicios .NET

---

## 8. Recursos Adicionales

### Documentación
- [Angular Style Guide](https://angular.dev/style-guide)
- [.NET Architecture](https://learn.microsoft.com/en-us/dotnet/architecture/)
- [Spring Boot Best Practices](https://spring.io/guides)
- [Kong Documentation](https://docs.konghq.com/)

### Herramientas
- Postman Collection: `docs/api/postman/school-guardian.postman_collection.json`
- OpenAPI Specs: `docs/api/openapi/`
- DBML: `docs/database/db-school-guardian.dbml`

### Contacto
- Tech Lead: [nombre]
- Backend Lead: [nombre]
- Frontend Lead: [nombre]

---

**Última actualización:** 2026-10-05
**Versión:** 1.0
