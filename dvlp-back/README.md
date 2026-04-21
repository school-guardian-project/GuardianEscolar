# Backend

Dentro de carpeta `dvlp-back` se encuentra la arquitectura base, principalmente para la gestion de la `API`:

## Estructura del Proyecto (src/backend)

### API/
Contiene los controladores de la API y el punto de entrada de la aplicacion.
- **Controllers/**: Controladores HTTP para manejar las peticiones entrantes.
- **Program.cs**: Configuracion e inicio de la aplicacion ASP.NET Core.

### Application/
Capa de logica de aplicacion con servicios, interfaces y DTOs.
- **DTOs/**: Objetos de Transferencia de Datos para comunicacion entre capas.
- **Interfaces/**: Contratos para los servicios.
- **Services/**: Implementacion de la logica de negocio.

### Domain/
Entidades del dominio del negocio, organizadas por modulos:
- **Academic/**: Course, CourseGroup, SchoolCampuse - Cursos, Grupos y Sedes academicas.
- **Alerts/**: Alert, AlertType, SavedAlerts - Tipos de alertas, alertas y alertas guardadas.
- **Exceptions/**: DriverLicense, ExceptionalDriverUsage, ExceptionalRouteUsage - Permisos y excepciones.
- **Family/**: Family, FamilyMember - Familia y integrantes.
- **School/**: City, School - Ciudades y escuelas.
- **Security/**: Action, Module, Role, RoleModule, View, ViewAction, ViewModule - Sistema de permisos y seguridad.
- **Transport/**: Boarding, Bus, Route, RouteBusAssignments, RouteStop, RouteStudentAssignments, Stop - Gestion de transporte escolar.
- **Users/**: Person, Profile, ProfileRole - Personas, perfiles y roles de usuario.

### Infrastructure/
Configuracion de infraestructura y acceso a datos.
- **Data/Configuration/**: Configuraciones de Entity Framework por dominio (Academic, Alerts, Exceptions, Family, School, Security, Transport, Users).
- **Data/Context/**: AppDbContext - Contexto de base de datos.
- **Data/Migrations/**: Migraciones de Entity Framework.
- **Repositories/**: (Vacio - implementar repositorios para futuras modificaciones).

<!-- ### bin/
Directorio de salida de compilacion (contiene archivos .dll y .exe generados).

### obj/
Directorio temporal de compilacion (archivos intermedios de build).

### Properties/
Configuraciones de inicio (launchSettings.json). -->
