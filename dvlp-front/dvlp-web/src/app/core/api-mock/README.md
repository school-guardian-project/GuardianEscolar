# Mock API Web — json-server (TEMPORAL)

Simula `Cliente (Angular) -> Backend (json-server :3000) -> DB (db.json)` sin tocar `AuthService` real.

## Qué se creó
- `mock-api.config.ts` — toggle `enabled` + `baseUrl`
- `mock-api.service.ts` — wrapper HttpClient con log Cliente→API→DB
- `mock-auth.service.ts` — login persons→profiles→roles (paridad con móvil)

## Uso (inyectar solo donde se necesite para demo)
```ts
import { MockApiService } from '@core/api-mock/mock-api.service';
import { MockAuthService } from '@core/api-mock/mock-auth.service';

// En componente:
private mockApi = inject(MockApiService);
private mockAuth = inject(MockAuthService);

this.mockApi.list('/routes').subscribe(r => console.log('Rutas desde DB', r));
this.mockAuth.login('admin1@colegio.edu.co','demo').subscribe(s => console.log(s));
```

## Desactivar / remover
```bash
# Toggle
# en mock-api.config.ts -> enabled: false

# Borrado total (sin rastro)
rm -rf src/app/core/api-mock
# No se tocó environment.ts ni AuthService, no hay revert necesario
```

## Infra
- json-server :3000, Scalar docs :3001 (ver `school-guardian/json-server/docker-compose.yml`)
- `docker compose up -d` dentro de `school-guardian/json-server`
