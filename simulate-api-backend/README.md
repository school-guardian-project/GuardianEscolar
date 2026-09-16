# Simulate API Backend

Esta carpeta contiene la lógica de negocio que simula el comportamiento del backend real.
Está aislada del frontend para mantener la separación de responsabilidades.

## Estructura

```
simulate-api-backend/
├── config/                    # Configuración de APIs mock
│   ├── api.config.js         # Config móvil (Expo)
│   └── mock-api.config.ts    # Config web (Angular)
├── services/                  # Servicios de negocio
│   ├── auth/                  # Autenticación y perfil
│   │   ├── services.js        # AuthService móvil
│   │   ├── profileUpdate.service.js  # ProfileUpdate móvil
│   │   ├── mock-auth.service.ts      # MockAuthService web
│   │   └── profile-update.service.ts # ProfileUpdateService web
│   ├── api/                   # Cliente HTTP móvil
│   │   ├── api.client.js
│   │   ├── api.validators.js
│   │   ├── api.errors.js
│   │   └── api.cache.js
│   ├── mock-api/              # Servicio HTTP web
│   │   ├── mock-api.service.ts
│   │   ├── mock-api.validators.ts
│   │   ├── mock-api.errors.ts
│   │   ├── mock-api.cache.ts
│   │   └── card-list.data.service.ts
│   └── mappers/               # Transformación de datos
│       └── card-list.mapper.ts
├── db/                        # Base de datos mock
│   └── openapi.json           # Especificación OpenAPI
└── shared/                    # Código compartido
    ├── endpoints.js           # Endpoints centralizados
    ├── config.js              # Configuración compartida
    └── index.js               # Exportaciones
```

## Flujo

```
Frontend (Web/Móvil) → simulate-api-backend → json-server (:3000) → db.json
```

## Uso

Los frontends importan desde esta carpeta en lugar de tener la lógica de negocio embebida.
