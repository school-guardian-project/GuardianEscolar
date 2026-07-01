# Arquitectura del Frontend Web - School Guardian

## Stack Tecnológico

- **Framework**: Angular 21 (Standalone Components)
- **Lenguaje**: TypeScript (strict mode)
- **HTTP**: Angular HttpClient con interceptors funcionales
- **Traducciones**: @ngx-translate/core
- **Iconos**: Phosphor Icons (@phosphor-icons/web) + Angular Material (@angular/material)
- **Estilos**: CSS/SCSS vanilla sin framework de UI
- **Containerización**: Docker + Docker Compose

## Arquitectura: Feature-Based + Standalone Components

El frontend utiliza una **arquitectura basada en funcionalidades (Feature-Based)** combinada con **Standalone Components**. Esto significa que cada funcionalidad del sistema se agrupa en una carpeta independiente con todo lo que necesita, y cada componente es autónomo sin depender de NgModules.

### Estructura general

```
src/
├── app/
│   │
│   ├── app.ts                          Componente raíz
│   ├── app.config.ts                   Proveedores globales (HTTP, router, traducciones)
│   ├── app.routes.ts                   Definición de rutas globales
│   ├── app.css
│   ├── app.html
│   │
│   ├── core/                           Capa base transversal
│   │   ├── config/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts
│   │   └── services/
│   │       ├── abstract-crud.service.ts
│   │       ├── api.service.ts
│   │       └── security/
│   │           └── auth.service.ts
│   │
│   ├── features/                       Módulos funcionales del negocio
│   │   ├── admin/                      Gestión admin (usuarios, buses, rutas, paradas)
│   │   ├── dashboard/                  Dashboards según rol (admin, superadmin)
│   │   ├── profile/                    Perfil del usuario (información, cambio de email/password/contacto)
│   │   ├── public/                     Rutas públicas (login, home, contacto, forgot-password)
│   │   └── superadmin/                 Gestión superadmin (admins, colegios)
│   │
│   └── shared/                         Componentes y utilidades reutilizables
│       ├── components/                 Componentes compartidos
│       │   ├── change/                 change-password, change-information
│       │   ├── modal/                  Modales reutilizables
│       │   └── navbar/                 Barra de navegación
│       ├── footer/
│       ├── main/
│       └── validator/                  Validadores personalizados (passwordMatch)
│
├── environments/                       Configuración por entorno
│   ├── environment.ts
│   └── environment.prod.ts
│
└── assets/
    └── i18n/                           Archivos de traducción (JSON)
```

### Estructura interna de un Feature

```
features/{modulo}/
└── pages/
    └── {pagina}/
        ├── {pagina}.ts               Componente principal
        ├── {pagina}.html             Template
        ├── {pagina}.css              Estilos
        ├── {pagina}.routes.ts        Rutas hijas (opcional)
        └── steps/                    Sub-pasos del flujo (opcional)
            └── {step}/
                ├── {step}.ts
                ├── {step}.html
                └── {step}.css
```

Ejemplo real:

```
features/profile/pages/change-password/
├── change-password.ts
├── change-password.html
├── change-password.css
├── change-password.routes.ts
└── steps/
    ├── code/
    │   ├── code.ts
    │   ├── code.html
    │   └── code.css
    └── reset/
        ├── reset.ts
        ├── reset.html
        └── reset.scss
```

### Estructura interna de Shared

```
shared/
├── components/                       Componentes reutilizables
│   └── change/
│       ├── change-password/          Plantilla para flujos de contraseña
│       │   ├── change-password.ts
│       │   ├── change-password.html
│       │   └── change-password.scss
│       └── change-information/       Plantilla para flujos de información
│           ├── change-information.ts
│           ├── change-information.html
│           └── change-information.scss
│
├── footer/
├── main/
│
└── validator/                        Validadores personalizados
    └── password-match.validator.ts
```

## Patrones Arquitectónicos

### 1. Feature-Based Architecture (Basada en Funcionalidades)

Cada funcionalidad del sistema se agrupa en una carpeta independiente que contiene su propio componente, HTML, estilos y rutas. Esto mantiene el código organizado por dominio de negocio, no por tipo de archivo.

**Ventajas:**
- Escalabilidad: agregar una nueva funcionalidad no afecta las existentes
- Cohesión: todo lo relacionado a una funcionalidad está en un solo lugar
- Facilita la eliminación o refactorización de funcionalidades completas

### 2. Standalone Components

Todos los componentes son autónomos (`standalone: true`) y declaran sus propias dependencias en el `imports`, eliminando la necesidad de NgModules.

```typescript
@Component({
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, ...],
  templateUrl: './reset.html',
  styleUrl: './reset.scss',
})
export class Reset { ... }
```

**Ventajas:**
- Menos archivos de configuración (sin NgModules)
- Cada componente es independiente y fácil de reutilizar
- Mejor tree-shaking (Angular elimina lo que no se usa)

### 3. Service Layer

Los componentes nunca llaman directamente a HttpClient. Toda la comunicación con el backend se centraliza en servicios por capas:

```
Componente → Service específico → ApiService genérico → HttpClient → Backend
```

- **ApiService**: Servicio genérico con métodos CRUD tipados (`getAll`, `getById`, `create`, `update`, `delete`)
- **AbstractCrudService**: Clase abstracta que evita repetir código por cada entidad
- **AuthService**: Servicio independiente para autenticación (login, token, logout)
- **Entity Services**: Servicios específicos que heredan de AbstractCrudService

### 4. Lazy Loading con Children Routes

Los flujos complejos (como forgot-password o change-email) usan rutas hijas para dividir la navegación sin recargar el componente padre:

```typescript
{ path: 'admin/change-email', component: ChangeEmail, children: changeEmailRoutes }
```

## Flujo de Datos

```
Usuario interactúa con la View (HTML)
        ↓
View enlaza con el FormGroup o eventos del componente (.ts)
        ↓
Componente llama a un método del Service
        ↓
Service usa ApiService o HttpClient para hacer la petición HTTP
        ↓
Backend responde con JSON
        ↓
Service devuelve Observable<T>
        ↓
Componente se suscribe y actualiza el estado
        ↓
Angular actualiza la View automáticamente
```

## Seguridad

- Autenticación mediante JWT almacenado en localStorage
- Interceptor HTTP funcional que agrega el token a cada petición
- Guards de ruta para proteger páginas según autenticación
- Roles incluidos en el JWT para autorización en backend
