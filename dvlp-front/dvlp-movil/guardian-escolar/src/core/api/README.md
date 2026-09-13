# Mock API — json-server (TEMPORAL)

> Simulación `Cliente (Frontend Expo) -> Backend (json-server :3000) -> DB (db.json)`
> Todo lo aquí creado es **aislado y removible** sin contaminar el proyecto.

## Qué se creó
- `src/core/api/api.config.js` — toggle `ENABLED` y `BASE_URL`
- `src/core/api/api.client.js` — fetch wrapper + factory `createResource`
- `src/core/api/services.js` — servicios tipados según `openapi.json` + `authService.login()`
- `src/core/api/hooks/useApi.js` — hook loading/error
- Modificación mínima en `src/features/auth/views/Login/Login.jsx` (marcada `// [MOCK-API]`)

## Cómo usar
```js
import { routeService, personService, authService } from "@core/api/services";
import { useApi } from "@core/api/hooks/useApi";

// CRUD directo (json-server REST)
const routes = await routeService.list(); // GET /routes
const me = await personService.query({ Email: "admin1@colegio.edu.co" });

// Login simulado (persons -> profiles -> roles)
const session = await authService.login(email, password);
// { person, profile, role: "admin", appRole: "student", token }

// Hook en componente
const { data, loading, error } = useApi(() => routeService.list(), []);
```

## Endpoints disponibles (según openapi.json)
Ver `ENDPOINTS` en `api.config.js`. 37 paths: profiles, persons, families, buses, routes, route-stops, boardings, alerts, etc.

## Cómo desactivar / remover (sin dejar rastro)
1. Poner `ENABLED: false` en `api.config.js` — vuelve al comportamiento anterior (navegación directa).
2. Para borrar por completo:
```bash
rm -rf src/core/api
# Revertir Login.jsx al original:
git checkout -- src/features/auth/views/Login/Login.jsx
# (opcional) revertir MainPage.jsx si se tocó
```
Ningún `package.json` fue modificado; no se añadió axios ni deps nuevas (usa `fetch` nativo).

## Infra
- `json-server` → http://localhost:3000 (container `school-guardian-api`, imagen `clue/json-server`)
- Docs OpenAPI (Scalar) → http://localhost:3001
- Fuente: `~/Documentos/projects/school-guardian/json-server/{db.json,openapi.json,docker-compose.yml}`
- Levantar: `cd ~/Documentos/projects/school-guardian/json-server && docker compose up -d`
