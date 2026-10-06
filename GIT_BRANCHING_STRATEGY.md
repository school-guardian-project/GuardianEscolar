# Estrategia de Ramas Git - School Guardian

## Resumen

Este documento define la estrategia de ramas Git, convenciones de naming y flujo de trabajo para el proyecto School Guardian.

## Ramas Principales

### `main`
- **Propósito**: Código en producción
- **Protegida**: Sí (requiere PR aprobado)
- **Origen de**: `develop`
- **Tags**: Semánticos (v1.0.0, v1.1.0, etc.)
- **Estado**: Siempre estable y desplegable

### `develop`
- **Propósito**: Integración continua de features
- **Protegida**: Sí (requiere PR aprobado)
- **Origen de**: `main`
- **Estado**: Código estable listo para release

## Ramas de Trabajo

### `feature/*`
- **Propósito**: Nuevas funcionalidades
- **Origen de**: `develop`
- **Merge a**: `develop`
- **Naming**: `feature/descripcion-corta-en-ingles`
- **Ejemplos**:
  - `feature/backend-frontend-integration`
  - `feature/user-profile-endpoint`
  - `feature/mobile-push-notifications`
  - `feature/dropdown-campuses`

### `fix/*`
- **Propósito**: Corrección de bugs
- **Origen de**: `develop`
- **Merge a**: `develop`
- **Naming**: `fix/descripcion-corta-en-ingles`
- **Ejemplos**:
  - `fix/auth-interceptor-token`
  - `fix/bus-form-validation`
  - `fix/mobile-session-refresh`

### `hotfix/*`
- **Propósito**: Parches urgentes a producción
- **Origen de**: `main`
- **Merge a**: `main` y `develop`
- **Naming**: `hotfix/descripcion-corta-en-ingles`
- **Ejemplos**:
  - `hotfix/critical-security-patch`
  - `hotfix/database-connection-leak`

### `refactor/*`
- **Propósito**: Refactorización sin cambio funcional
- **Origen de**: `develop`
- **Merge a**: `develop`
- **Naming**: `refactor/descripcion-corta-en-ingles`
- **Ejemplos**:
  - `refactor/extract-base-service`
  - `refactor/simplify-auth-flow`

### `docs/*`
- **Propósito**: Solo documentación
- **Origen de**: `develop`
- **Merge a**: `develop`
- **Naming**: `docs/descripcion-corta-en-ingles`
- **Ejemplos**:
  - `docs/integration-plan`
  - `docs/api-reference`

## Convenciones de Commits (Conventional Commits)

### Formato
```
<tipo>(<alcance>): <descripción corta>

<cuerpo opcional>

<footer opcional>
```

### Tipos
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Solo documentación
- `style`: Cambios de formato (sin cambio de lógica)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento (deps, config, etc.)

### Alcances (sugeridos)
- `web`: Frontend web (Angular)
- `mobile`: Frontend mobile (Expo/React Native)
- `iam`: Microservicio de autenticación
- `fleet`: Microservicio de flota
- `route`: Microservicio de rutas
- `school`: Microservicio de escuelas
- `user`: Microservicio de usuarios
- `api`: API Gateway (Kong)
- `db`: Base de datos

### Ejemplos

#### Feature
```bash
feat(web): add dropdown selector component

- Create reusable DropdownSelector component
- Support async option loading
- Add loading state with spinner
- Integrate with ReactiveForms
```

#### Fix
```bash
fix(web): correct auth interceptor to send token to all endpoints

- Auth interceptor now sends Bearer token to all endpoints except login/refresh
- Previously only sent token to /api/v1/auth/ endpoints
- This was blocking all business endpoints from receiving authentication
```

#### Mobile
```bash
feat(mobile): add API client with automatic token refresh

- Create apiClient with automatic Bearer token injection
- Implement automatic refresh on 401 responses
- Add session cleanup on refresh failure
- Create profileService, campusesService, vehicleTypesService
```

#### Backend
```bash
feat(iam): add user profile endpoint

- Add GET /api/v1/auth/profile endpoint
- Extract profile data from JWT claims
- Include roleName from database lookup
- Add UserProfileDto for response
```

#### Docs
```bash
docs: add integration plan and dropdown usage examples

- Add comprehensive integration plan with architecture diagrams
- Add dropdown component usage examples for web and mobile
- Include backend API reference and testing examples
```

## Flujo de Trabajo

### 1. Iniciar nueva funcionalidad

```bash
# Asegurarse de estar en develop actualizado
git checkout develop
git pull origin develop

# Crear rama feature
git checkout -b feature/nueva-funcionalidad

# Trabajar y commitear
git add .
git commit -m "feat(web): add new feature"

# Push y crear PR
git push origin feature/nueva-funcionalidad
```

### 2. Code Review y Merge

1. Crear Pull Request en GitHub
2. Asignar revisores
3. Esperar aprobación (mínimo 1 reviewer)
4. Resolver comentarios si hay
5. Merge via GitHub (Squash and merge recomendado)

### 3. Release a producción

```bash
# Merge develop a main
git checkout main
git pull origin main
git merge develop

# Crear tag
git tag v1.2.0
git push origin main --tags

# Merge main de vuelta a develop (si hubo hotfixes)
git checkout develop
git merge main
git push origin develop
```

### 4. Hotfix urgente

```bash
# Crear hotfix desde main
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix

# Implementar fix
git add .
git commit -m "fix: critical security patch"

# Merge a main
git checkout main
git merge hotfix/critical-fix
git tag v1.2.1
git push origin main --tags

# Merge a develop también
git checkout develop
git merge hotfix/critical-fix
git push origin develop

# Eliminar rama hotfix
git branch -d hotfix/critical-fix
```

## Reglas de Protecciones de Ramas

### `main` y `develop`
- ✅ Requieren Pull Request
- ✅ Requieren al menos 1 aprobación
- ✅ Requieren CI passing
- ✅ No se puede hacer push directo
- ✅ No se puede force push

### Ramas `feature/*`, `fix/*`, etc.
- ✅ Push directo permitido
- ✅ Force push permitido (para rebase)
- ⚠️ Se eliminan después de merge

## Tags Semánticos

### Formato
```
v<major>.<minor>.<patch>
```

### Cuándo incrementar
- **Major** (v2.0.0): Breaking changes
- **Minor** (v1.1.0): Nuevas funcionalidades (backward compatible)
- **Patch** (v1.0.1): Bug fixes

### Ejemplos
```bash
# Feature nueva
git tag v1.1.0

# Bug fix
git tag v1.1.1

# Breaking change
git tag v2.0.0
```

## Buenas Prácticas

### ✅ Hacer
- Commits pequeños y atómicos
- Mensajes de commit descriptivos
- Pull Requests pequeños y enfocados
- Revisar código de otros
- Mantener ramas actualizadas con develop
- Eliminar ramas después de merge

### ❌ No hacer
- Commits gigantes con múltiples cambios
- Mensajes de commit vagos ("fix bug", "update code")
- PRs de más de 500 líneas
- Merge sin review
- Ramas de larga duración (más de 1 semana)
- Trabajar directamente en develop o main

## Herramientas Recomendadas

### Git CLI
```bash
# Ver estado
git status

# Ver log con gráfico
git log --oneline --graph --all

# Ver diff antes de commit
git diff --staged

# Rebase interactivo para limpiar commits
git rebase -i HEAD~3

# Stash cambios temporales
git stash
git stash pop
```

### GitHub
- Pull Requests con template
- Code review con comentarios
- CI/CD automático
- Protected branches
- Branch protection rules

### VS Code
- GitLens extension
- Git Graph extension
- Conventional Commits extension

## Resumen Visual

```
main       ●─────●─────────●─────────● (v1.2.0)
             \     \         \         \
develop       ●─────●────●────●────●────●
               \         \         \
feature/*       ●────●    \         \
                         \         \
fix/*                     ●────●    \
                                   \
hotfix/*                            ●────●
```

## Recursos

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

---

**Última actualización**: 2026-10-05
**Versión**: 1.0
