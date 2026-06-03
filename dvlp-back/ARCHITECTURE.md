# Arquitectura del Backend - School Guardian

## Stack Tecnológico

- **Framework**: ASP.NET Core 10.0
- **ORM**: Entity Framework Core 10.0.5 con PostgreSQL
- **Autenticación**: JWT (Json Web Tokens)
- **Documentación API**: Swagger / Swashbuckle 6.6.2
- **Containerización**: Docker + Docker Compose
- **Hashing**: PasswordHasher (Microsoft.AspNetCore.Identity)
- **Base de datos**: PostgreSQL 14+

## Arquitectura Modular

El backend sigue una **arquitectura modular en capas**. Está diseñado para que cada módulo funcional pueda, en el futuro, convertirse en un microservicio independiente. Cada módulo contiene todo lo necesario para su dominio (entidades, lógica, configuración de BD y endpoints).

### Estructura general

```
Api/                        Punto de entrada, middlewares y configuración global
├── Program.cs
├── appsettings.json
└── Middleware/

Modules/                    Módulos funcionales independientes
├── UserManagement/
├── Security/
├── FleetManagement/
├── RouteManagement/
├── SchoolManagement/
├── AlertManagement/
└── BoardingManagement/

Shared/                     Código compartido entre módulos
├── Exceptions/
└── Responses/

Infrastructure/             Persistencia global (DbContext y migraciones)
└── Persistence/
    ├── Context/
    ├── Configuration/
    └── Migrations/
```

### Estructura interna de cada módulo

```
{Módulo}/
├── Api/Controllers/            Endpoints HTTP del módulo
├── Application/
│   ├── DTOs/                   Objetos de transferencia de datos
│   └── Services/               Implementación de la lógica de negocio
├── Domain/
│   ├── Entities/               Modelos de dominio
│   └── Interfaces/             Contratos de servicios y repositorios
└── Infrastructure/
    └── Configurations/         Configuraciones Entity Framework (Fluent API)
```

## Módulos del Sistema

### Security (Completamente implementado)
Autenticación, autorización y control de acceso basado en roles (RBAC).
Contiene: AuthService, JwtService, PasswordService, Profile, Role, permisos y vistas.

### UserManagement
Gestión de personas, familias, licencias de conducir y tipos de identificación.
Entidades: Person, Family, FamilyMember, DriverLicense, IdentificationType.

### FleetManagement
Administración de la flota de vehículos: autobuses, marcas, modelos y líneas.
Entidades: Bus, Brand, Model, Line, LineModel, ExceptionalDriverUsage.

### RouteManagement
Planificación de rutas de transporte, paradas y asignaciones de estudiantes.
Entidades: Route, Stop, RouteStop, RouteBusAssignments, RouteStudentAssignments, ExceptionalRouteUsage.

### SchoolManagement
Instituciones educativas, sedes, cursos y grupos académicos.
Entidades: School, City, Course, CourseGroup, SchoolCampuse.

### AlertManagement
Sistema de alertas y notificaciones del sistema.
Entidades: Alert, AlertType, SavedAlert.

### BoardingManagement
Registro y control de estudiantes que abordan los vehículos.
Entidades: Boarding.

## Patrones Arquitectónicos

- **Arquitectura en capas** dentro de cada módulo (Api → Application → Domain → Infrastructure)
- **DbContext centralizado**: Un solo AppDbContext para todo el proyecto, con configuraciones aplicadas por módulo
- **Fluent API**: Configuración de entidades mediante archivos independientes por módulo
- **Inyección de dependencias**: Servicios registrados en el contenedor de ASP.NET Core
- **Manejo global de excepciones**: Middleware centralizado para errores HTTP

## Seguridad

- Autenticación mediante JWT con validación de Issuer y Audience
- Autorización basada en roles (RBAC)
- Contraseñas hasheadas con PasswordHasher
- CORS configurable para orígenes permitidos
- User Secrets para desarrollo local

## Contenedores

- **Dockerfile**: Compilación multi-etapa para producción
- **dev.Dockerfile**: Entorno de desarrollo con hot-reload
- **docker-compose.yml**: Orquestación para producción
- **docker-compose.dev.yml**: Desarrollo con backend, frontend, Liquibase, Jenkins, SonarQube y Nginx

## Estado de Migración Modular

| Módulo | Entidades | Config EF | Interfaces | Servicios | DTOs | Controllers |
|--------|:---------:|:---------:|:----------:|:---------:|:----:|:-----------:|
| Security | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| UserManagement | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| FleetManagement | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| RouteManagement | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| SchoolManagement | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| AlertManagement | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| BoardingManagement | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Estrategia de Evolución

> [!NOTE]
> **Completar módulos**: Implementar servicios, DTOs y controladores faltantes
> 
> **Separar proyectos**: Cada módulo a su propio `.csproj` con un proyecto SharedKernel
>
> **Microservicios**: Despliegue independiente por módulo con API Gateway y comunicación asíncrona
