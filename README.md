# GuardianEscolar

## Estructura del Proyecto

```
school-guardian-project/
├── dvlp-back/                    # Backend real (ASP.NET Core)
├── dvlp-front/                   # Frontends
│   ├── dvlp-web/                # Frontend Web (Angular)
│   └── dvlp-movil/              # Frontend Móvil (React Native/Expo)
├── simulate-api-backend/         # Lógica de negocio simulada (AISLADA)
│   ├── config/                  # Configuración de APIs mock
│   ├── services/                # Servicios de negocio
│   │   ├── auth/                # Autenticación y perfil
│   │   ├── api/                 # Cliente HTTP móvil
│   │   ├── mock-api/            # Servicio HTTP web
│   │   └── mappers/             # Transformación de datos
│   ├── db/                      # Base de datos mock (openapi.json)
│   └── shared/                  # Código compartido
└── database/                    # Migraciones Liquibase
```

## Arquitectura

La lógica de negocio simulada está **completamente aislada** del frontend en la carpeta `simulate-api-backend/`. Esta separación ensure que:

1. **Frontends** solo contienen lógica de presentación (UI/UX)
2. **simulate-api-backend** contiene toda la lógica de negocio mock
3. **dvlp-back** contiene el backend real (ASP.NET Core)

### Flujo de Datos

```
Frontend (Web/Móvil) → simulate-api-backend → json-server (:3000) → db.json
```
