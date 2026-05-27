# Arquitectura del Backend

El backend de School Guardian está construido con **ASP.NET Core 10.0** siguiendo una arquitectura en capas limpia. Se encuentra en la carpeta `dvlp-back` y proporciona una API RESTful robusta para la gestión integral del sistema de transporte escolar.

## Stack Tecnológico

- **Framework**: ASP.NET Core 10.0
- **ORM**: Entity Framework Core 10.0.5
- **Base de Datos**: PostgreSQL (Npgsql.EntityFrameworkCore.PostgreSQL 10.0.1)
- **API Documentation**: Swagger/Swashbuckle 6.6.2
- **Containerización**: Docker con multi-stage build

## Estructura del Proyecto (src/backend)

### API/
Capa de presentación - Punto de entrada de la aplicación.
- **Controllers/**: Controladores HTTP que manejan las peticiones entrantes.
- **Program.cs**: Configuración e inicialización de la aplicación ASP.NET Core, incluye:
  - Configuración de Entity Framework con PostgreSQL
  - Habilitación de CORS para origenes permitidos
  - Integración de Swagger para documentación API
  - Inyección de dependencias y middlewares

### Application/
Capa de lógica de aplicación con servicios reutilizables.
- **DTOs/**: Objetos de Transferencia de Datos para comunicación entre capas.
- **Interfaces/**: Contratos que definen los servicios.
- **Services/**: Implementación de la lógica de negocio y casos de uso.

### Domain/
Capa de dominio - Entidades de negocio organizadas por módulos funcionales:

- **Academic/**: Gestión académica
  - `Course`: Cursos disponibles en la escuela
  - `CourseGroup`: Grupos/secciones de cursos
  - `SchoolCampuse`: Sedes académicas de las instituciones

- **Alerts/**: Sistema de alertas
  - `Alert`: Alertas generadas en el sistema
  - `AlertType`: Tipos de alertas (seguridad, académicas, etc.)
  - `SavedAlert`: Alertas guardadas/favoritas por usuarios

- **Exceptions/**: Gestión de excepciones y permisos especiales
  - `DriverLicense`: Licencias de conducción de conductores
  - `ExceptionalDriverUsage`: Permisos excepcionales para conductores
  - `ExceptionalRouteUsage`: Excepciones en rutas de transporte

- **Family/**: Gestión de familias
  - `Family`: Información de familias de estudiantes
  - `FamilyMember`: Miembros de cada familia

- **School/**: Información educativa
  - `City`: Ciudades donde operan las escuelas
  - `School`: Instituciones educativas

- **Security/**: Control de acceso y seguridad
  - `Role`: Roles disponibles (Admin, Conductor, Estudiante, Padre/Madre)
  - `Action`: Acciones permitidas en el sistema
  - `Module`: Módulos del sistema
  - `ProfileRole`: Asignación de roles a perfiles
  - `View`, `ViewAction`, `ViewModule`: Control granular de permisos

- **Transport/**: Gestión de transporte escolar
  - `Bus`: Autobuses disponibles
  - `Route`: Rutas de transporte
  - `RouteStop`: Paradas en cada ruta
  - `Stop`: Información de paradas
  - `Boarding`: Registros de abordaje de estudiantes
  - `RouteBusAssignments`: Asignación de autobuses a rutas
  - `RouteStudentAssignments`: Asignación de estudiantes a rutas

- **Users/**: Gestión de usuarios
  - `Person`: Información de personas (estudiantes, padres, conductores, administrativos)
  - `Profile`: Perfil de usuario con información adicional
  - `ProfileRole`: Relación entre perfiles y roles

### Infrastructure/
Capa de infraestructura - Acceso a datos y configuración de persistencia.

- **Persistence/Context/**: Contexto de Entity Framework
  - `AppDbContext.cs`: Contexto principal que configura todos los DbSets y las migraciones de la base de datos

- **Persistence/Configuration/**: Configuraciones de Entity Framework por módulo
  - `Academic/`: Configuración de entidades académicas
  - `Alerts/`: Configuración de alertas
  - `Exceptions/`: Configuración de excepciones
  - `Family/`: Configuración de familias
  - `School/`: Configuración de escuelas
  - `Security/`: Configuración de seguridad
  - `Transport/`: Configuración de transporte
  - `Users/`: Configuración de usuarios

- **Persistence/Migrations/**: Migraciones de Entity Framework Core para control de versiones de esquema

## Configuración y Servicios

### Program.cs - Configuración Principal

El archivo `Program.cs` configura:

1. **Servicios de Base de Datos**
   ```csharp
   builder.Services.AddDbContext<AppDbContext>(options => 
       options.UseNpgsql("name=Conection"));
   ```
   - Usa PostgreSQL como base de datos principal
   - Connection string configurado en `appsettings.json`

2. **CORS (Control de Origen Cruzado)**
   - Lee orígenes permitidos desde configuración
   - Por defecto: `http://localhost:4200` (desarrollo)
   - Permite cualquier encabezado y método HTTP

3. **Documentación API (Swagger)**
   - Interfaz interactiva disponible en la raíz (`/`) en desarrollo
   - Documentación automática de todos los endpoints
   - Versión: v1

4. **Redirección HTTPS**
   - Obligatoria en producción
   - Configuración de seguridad estándar

### appsettings.json - Configuración

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "AllowedOrigins": "http://localhost:4200"
}
```

### Dependencias Principales

- **Microsoft.EntityFrameworkCore 10.0.5**: ORM para acceso a datos
- **Npgsql.EntityFrameworkCore.PostgreSQL 10.0.1**: Proveedor de base de datos PostgreSQL
- **Swashbuckle.AspNetCore 6.6.2**: Generación de documentación Swagger
- **Microsoft.AspNetCore.Mvc**: Framework MVC/API

## Dockerización

### Dockerfile (Multi-stage Build)

El proyecto incluye un `Dockerfile` optimizado con tres etapas:

1. **Base Stage**: 
   - Imagen base: `mcr.microsoft.com/dotnet/aspnet:10.0`
   - Expone puerto 8080

2. **Build Stage**:
   - Imagen del SDK: `mcr.microsoft.com/dotnet/sdk:10.0`
   - Restaura dependencias
   - Compila y publica la aplicación en Release

3. **Final Stage**:
   - Copia binarios compilados
   - Establece variables de entorno
   - Ambiente: Production
   - URL: `http://+:8080`
   - Entry point: `dotnet backend.dll`

### Dockerfiles Adicionales

- **dev.Dockerfile**: Imagen para desarrollo local
- **docker-compose.yml**: Orquestación de contenedores para producción
- **docker-compose.dev.yml**: Orquestación para desarrollo

## Patrones de Arquitectura

### Arquitectura en Capas
```
API (Controllers) → Application (Services, DTOs) → Domain (Entities) → Infrastructure (Context, Configuration)
```

### Entity Framework Core
- **DbContext**: `AppDbContext` centraliza toda la configuración de datos
- **Configuraciones por módulo**: Cada dominio tiene su propia configuración
- **Lazy Loading**: Habilitado para cargas relacionales bajo demanda

### Inyección de Dependencias
- Configuración en `Program.cs`
- Servicios registrados en el contenedor DI de ASP.NET Core

## Base de Datos

- **Motor**: PostgreSQL
- **Gestión de migraciones**: Entity Framework Core Migrations
- **Gestión de cambios**: Liquibase (archivos en carpeta `/liquibase`)
- **Esquema**: Soporta 8 módulos principales con múltiples tablas relacionadas

## Desarrollo y Testing

- **backend.http**: Archivo para pruebas manuales de endpoints
- **Migrations.sql**: Scripts SQL para migraciones manuales

## Consideraciones de Seguridad

- Validación de orígenes CORS
- Reducción de logs en producción (level Warning para ASP.NET Core)
- Variables de entorno para configuración sensible
- User secrets configurados: `4c3f7a05-46a2-4649-b4f5-e4c13683d832`

## Próximos Pasos

- Implementar repositorios en la carpeta `Infrastructure/Repositories/`
- Expandir servicios en `Application/Services/`
- Agregar DTOs en `Application/DTOs/`
- Implementar autenticación y autorización
- Agregar logging estructurado
- Implementar unit tests 