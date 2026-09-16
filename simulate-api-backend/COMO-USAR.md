# Cómo Usar Simulate API Backend

## Para Desarrolladores Frontend

Los frontends **ya están configurados** para usar los archivos en `simulate-api-backend/`. No necesitas cambiar nada.

### Frontend Web (Angular)

Los archivos en `dvlp-front/dvlp-web/src/app/core/api-mock/` importan desde:
- `@core/api-mock/*` (alias configurado en tsconfig.json)

### Frontend Móvil (React Native/Expo)

Los archivos en `dvlp-front/dvlp-movil/guardian-escolar/src/core/api/` importan desde:
- `@core/api/*` (alias configurado en tsconfig.json)

## Para Desarrolladores Backend

Si necesitas modificar la lógica de negocio mock:

1. **Configuración**: Edita archivos en `config/`
2. **Servicios de autenticación**: Edita archivos en `services/auth/`
3. **Cliente HTTP**: Edita archivos en `services/api/` (móvil) o `services/mock-api/` (web)
4. **Mappers**: Edita archivos en `services/mappers/`

## Estructura de Archivos

```
simulate-api-backend/
├── config/
│   ├── api.config.js          # Config para móvil (Expo)
│   └── mock-api.config.ts     # Config para web (Angular)
├── services/
│   ├── auth/
│   │   ├── services.js        # AuthService + dashboardService (móvil)
│   │   ├── profileUpdate.service.js  # ProfileUpdate (móvil)
│   │   ├── mock-auth.service.ts      # MockAuthService (web)
│   │   └── profile-update.service.ts # ProfileUpdateService (web)
│   ├── api/
│   │   ├── api.client.js      # Cliente HTTP (móvil)
│   │   ├── api.validators.js  # Validadores (móvil)
│   │   ├── api.errors.js      # Errores tipados (móvil)
│   │   └── api.cache.js       # Cache (móvil)
│   ├── mock-api/
│   │   ├── mock-api.service.ts    # Servicio HTTP (web)
│   │   ├── mock-api.validators.ts # Validadores (web)
│   │   ├── mock-api.errors.ts     # Errores tipados (web)
│   │   ├── mock-api.cache.ts      # Cache (web)
│   │   └── card-list.data.service.ts # DataService (web)
│   └── mappers/
│       └── card-list.mapper.ts # Transformación de datos (web)
├── db/
│   └── openapi.json           # Especificación OpenAPI
└── shared/
    ├── endpoints.js           # Endpoints centralizados
    ├── config.js              # Configuración compartida
    └── index.js               # Exportaciones
```

## Flujo de Datos

```
Frontend → simulate-api-backend → json-server (:3000) → db.json
```

## Notas Importantes

1. **No modificar archivos en frontend**: Los archivos en `dvlp-front/` son los que usan los frontends
2. **Modificar solo en simulate-api-backend**: Si necesitas cambiar la lógica, modifica aquí
3. **Sincronización**: Los archivos en `simulate-api-backend/` son una copia organizada de la lógica que estaba en los frontends
