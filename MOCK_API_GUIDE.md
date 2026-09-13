# Guía Mock API — Simulación Cliente → Backend → DB (TEMPORAL)

> Objetivo: conectar frontend Guardian Escolar (móvil Expo + web Angular) con `json-server` (http://localhost:3000) que expone `db.json` y `openapi.json`, simulando flujo completo sin contaminar el proyecto.

## Arquitectura simulada
```
Cliente (Frontend)  →  Backend (json-server :3000)  →  DB (db.json 18MB)
   ↓ fetch/HttpClient      ↓ Express + lowdb             ↓ 35 colecciones
 Login.jsx / MainPage  →  GET /persons?Email          →  persons[1562]
                       →  GET /profiles?PersonId      →  profiles[1562]
                       →  GET /roles?ID               →  roles[4]
                       →  GET /routes /stops etc.
Docs OpenAPI (Scalar) en http://localhost:3001 (openapi.json 37 paths)
```

## Qué se tocó (mínimo y reversible)

### Móvil (`dvlp-front/dvlp-movil/guardian-escolar`)
- **Nuevos (aislados):** `src/core/api/` (8 archivos + hook)
  - `api.config.js` — `BASE_URL` env-aware (`EXPO_PUBLIC_API_URL` override), `ENABLED`, `ENDPOINTS` 37 paths DRY
  - `api.errors.js` — `ApiError`/`ValidationError` con mensajes sanitizados (no leak de internals)
  - `api.validators.js` — `validateEmail`/`validatePassword`/`sanitizeQuery` whitelist por recurso (previene inyección, proto-pollution, overflow)
  - `api.cache.js` — cache TTL 60s + dedup de vuelos (rendimiento, evita 48k boardings sin límite)
  - `api.client.js` — `fetch` con validación, cache, dedup, retry 1× en 5xx/408, timeout AbortController, masking de PII en logs, paginación segura
  - `services.js` — DTO `toSessionDTO` (desacopla DB del dominio), validación, mensajes genéricos `Credenciales inválidas`, `list` con `_limit` 50→100
  - `hooks/useApi.js` — abort on unmount, mounted guard, cancelación de vuelo previo (evita leaks)
  - `README.md` + `index.js`
- **Editados (marcados `// [MOCK-API]`):**
  - `src/features/auth/views/Login/Login.jsx:9-55` — `handleLogin` con llamada real a `authService.login` + toggle `API_CONFIG.ENABLED` + manejo error + hint credenciales
  - `src/features/home/views/MainPage/MainPage.jsx:1-40` — badge `apiStatus` + `useEffect` que hace `routeService.list()` + `dashboardService.getRoutesWithStops()` para demostrar flujo

### Web (`dvlp-front/dvlp-web`)
- **Nuevos (aislados):** `src/app/core/api-mock/` (6 archivos)
  - `mock-api.config.ts`, `mock-api.errors.ts` (`MockApiError` sanitizado), `mock-api.validators.ts` (whitelist), `mock-api.cache.ts` (TTL), `mock-api.service.ts` (HttpClient + cache + timeout + masking + paginación), `mock-auth.service.ts` (DTO + validación)
- **Sin edits** en `environment.ts` ni `AuthService` (para no contaminar)

### Infra (`school-guardian/json-server`)
- No modificado. Contenedores: `school-guardian-api :3000`, `school-guardian-docs :3001`
- Levantar: `cd ~/Documentos/projects/school-guardian/json-server && docker compose up -d`
- Verificación: `curl "http://localhost:3000/persons?Email=admin1@colegio.edu.co"` → 200

## Cómo probar

### 1. Levantar mock
```bash
cd ~/Documentos/projects/school-guardian/json-server && docker compose up -d
curl http://localhost:3000/roles | jq
# Docs: http://localhost:3001
```

### 2. Móvil
```bash
cd dvlp-front/dvlp-movil/guardian-escolar && npm start
# En Login, usa: admin1@colegio.edu.co / cualquier clave
# Observa consola: [API] GET http://localhost:3000/persons?Email=... (Cliente -> Backend -> DB)
# En MainPage verás badge "API OK: 40 rutas · Cliente→API→DB"
```

### 3. Web (opcional)
```ts
// En cualquier componente standalone:
import { MockApiService } from '@core/api-mock/mock-api.service';
mockApi.list('/routes').subscribe(r => console.log(r));
mockAuth.login('admin1@colegio.edu.co','x').subscribe(console.log);
```

## Credenciales demo (de db.json)
- `admin1@colegio.edu.co` (Rol admin → appRole student)
- Cualquier password no vacía (PasswordHash es dummy `$2b$10$demo.hash...`)
- Otros: busca en db.json `persons[].Email`

## Buenas prácticas aplicadas (aunque sea simulación)

**Reutilización / DRY:** `createResource` factory, `sanitizeQuery`/`validateEmail` centralizados, `toSessionDTO` mapper, `MOCK_ENDPOINTS` único, `useApi` genérico.

**Rendimiento:** cache 60s en memoria + dedup de requests en vuelo, `AbortController` + `mounted` guard, paginación `_limit:50` (cap 100) evita traer `boardings` 48k, debounce implícito en `Login` (`if(loading) return`), cancelación de vuelo previo en `useApi`.

**Seguridad:** validación de entrada (regex email, length checks, whitelist de filtros, `assertSafePath` contra `..`/`//`, bloqueo `__proto__`), sanitización via `URLSearchParams`, masking de `Email` en logs, nunca logear password/token, `ApiError.fromResponse` con mensajes genéricos (no revela si email existe → `Credenciales inválidas`), rate-limit en Login (`BLOCK_AFTER 5`), `ApiError` no expone `data` crudo a UI, timeout 8s + retry solo en 5xx/408, `FALLBACK_TO_MOCK` no expone stack.

**Calidad:** `ApiError`/`ValidationError` tipados, JSDoc, DTO desacopla DB del dominio, feature flag `ENABLED` + `EXPO_PUBLIC_API_URL` env-aware, sin secretos hardcodeados, sin nuevas deps.

## Nota json-server (campo id)
- `roles` usa `ID` mayúscula, `persons/profiles` usan `Id`. Por eso `GET /roles/1` da 404 y se usa `GET /roles?ID=1`. El código ya contempla esto.

## Cómo quitar (sin dejar rastro)
```bash
# Opción A: desactivar (mantiene archivos pero vuelve a navegación directa)
# En src/core/api/api.config.js -> ENABLED: false
# En src/app/core/api-mock/mock-api.config.ts -> enabled: false

# Opción B: borrado total
rm -rf dvlp-front/dvlp-movil/guardian-escolar/src/core/api
rm -rf dvlp-front/dvlp-web/src/app/core/api-mock
git checkout -- dvlp-front/dvlp-movil/guardian-escolar/src/features/auth/views/Login/Login.jsx
git checkout -- dvlp-front/dvlp-movil/guardian-escolar/src/features/home/views/MainPage/MainPage.jsx
rm MOCK_API_GUIDE.md

# No se tocó package.json, no hay deps que desinstalar
```
