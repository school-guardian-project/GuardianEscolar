# Documentación Jenkins, SonarQube y Contenedores - School Guardian Project

## Tabla de Contenidos
1. [Introducción](#introducción)
2. [Estructura de Carpetas](#estructura-de-carpetas)
3. [Componentes Principales](#componentes-principales)
4. [Configuración de Contenedores](#configuración-de-contenedores)
5. [Guía de Uso - Jenkins](#guía-de-uso---jenkins)
6. [Guía de Uso - SonarQube](#guía-de-uso---sonarqube)
7. [Pipeline CI/CD Multibranch](#pipeline-cicd)
8. [Dockerfiles](#dockerfiles)
9. [Comandos Útiles](#comandos-útiles)

---

## Introducción

Este proyecto utiliza **Jenkins** como herramienta de integración continua (CI/CD) y **SonarQube** para análisis de calidad de código. Ambas aplicaciones se ejecutan en contenedores Docker orquestados con Docker Compose, permitiendo un entorno de desarrollo y despliegue automatizado y consistente.

### Objetivos
- Automatizar la compilación y testing del código en todas las ramas
- Detectar automáticamente nuevas ramas y Pull Requests
- Analizar la calidad del código con SonarQube
- Generar artefactos Docker optimizados (en rama `develop`)

---

## Estructura de Carpetas

```
school-guardian-project/
├── Dockerfile.jenkins           # Imagen personalizada de Jenkins
├── Jenkinsfile                  # Definición del pipeline CI/CD
├── docker-compose.yml           # Configuración producción
├── docker-compose.dev.yml       # Configuración desarrollo
├── dvlp-back/
│   └── src/backend/
│       ├── Dockerfile           # Imagen producción backend
│       ├── dev.Dockerfile       # Imagen desarrollo backend
├── dvlp-front/
    ├── dvlp-web/
    │   ├── Dockerfile           # Imagen producción frontend
    │   ├── dev.Dockerfile       # Imagen desarrollo frontend
    │   ├── angular.json         # Configuración Angular
    │   ├── nginx.conf           # Configuración Nginx
    │   └── dist/                # Artefactos compilados
    └── dvlp-movil/              # Aplicación móvil (MAUI)
```

---

## Componentes Principales

### 1. Jenkins
- **Puerto**: 9090 (interfaz web)
- **Puerto de agentes**: 50000
- **Contenedor**: `jenkins_container`
- **Volumen persistente**: `jenkins_home`
- **Funcionalidad**: 
  - Detecta cambios en git
  - Ejecuta pipelines de compilación
  - Crea imágenes Docker
  - Dispara análisis con SonarQube

### 2. SonarQube
- **Puerto**: 9000 (interfaz web)
- **Contenedor**: `sonarqube`
- **Volúmenes persistentes**: 
  - `sonarqube_data`: Base de datos
  - `sonarqube_extensions`: Plugins
- **Funcionalidad**:
  - Análisis estático de código
  - Detección de vulnerabilidades
  - Reportes de cobertura de tests
  - Métricas de mantenibilidad

### 3. Nginx (Reverse Proxy)
- **Puerto HTTP**: 80
- **Puerto HTTPS**: 443
- **Contenedor**: `jenkins-nginx`
- **Función**: Enrutador de requests hacia Jenkins y otros servicios

### 4. Backend (.NET)
- **Puerto**: 8080
- **Contenedor desarrollo**: `backend-container-dev`
- **Contenedor producción**: `guardian-backend`
- **Framework**: .NET 10
- **Watch mode**: Recarga automática en desarrollo

### 5. Frontend (Angular)
- **Puerto desarrollo**: 4200
- **Puerto producción**: 80 (Nginx)
- **Contenedor desarrollo**: `frontend-container-dev`
- **Contenedor producción**: `guardian-frontend`
- **Servidor web**: Nginx en producción

---

## Configuración de Contenedores

### Docker Compose Development (`docker-compose.dev.yml`)

La configuración de desarrollo incluye:

```yaml
# Backend
backend:
  - Monta volumen local para hot reload
  - Ejecuta con 'dotnet watch run'
  - Variables de entorno para CORS
  - Puerto 8080 accesible

# Frontend
frontend-web:
  - Monta volumen local para hot reload
  - Ejecuta 'ng serve'
  - Puerto 4200 accesible
  - Cachea node_modules

# Jenkins
jenkins:
  - Construye desde Dockerfile.jenkins
  - Expone puertos 9090 y 50000
  - Volumen persistente jenkins_home
  - Conexión a docker.sock para Docker in Docker

# SonarQube
sonarqube:
  - Imagen oficial sonarqube:lts
  - Volúmenes para data, logs y extensiones
  - Puerto 9000 para acceso web

# Nginx
nginx:
  - Proxies requests a Jenkins
  - Puertos 80 y 443

# Redes
networks:
  - jenkins_net: Comunicación Jenkins/Nginx/SonarQube
  - sonar-net: Red de análisis de código
```

### Docker Compose Production (`docker-compose.yml`)

Configuración simplificada para producción:
- Solo backend y frontend compilados
- Contenedores más pequeños
- Sin volúmenes de desarrollo

---

## Guía de Uso - Jenkins

### Requisitos Previos
1. Docker instalado
2. Git configurado en la máquina
3. Token de SonarQube generado

### Paso 1: Iniciar el Contenedor de Jenkins

```bash
# Desde la raíz del proyecto
docker-compose -f docker-compose.dev.yml up -d jenkins sonarqube nginx

# Verificar que está corriendo
docker ps | grep jenkins
```

### Paso 2: Acceder a la Interfaz de Jenkins

1. Abrir navegador: `http://localhost:9090`
2. Obtener contraseña inicial:
   ```bash
   docker exec jenkins_container cat /var/jenkins_home/secrets/initialAdminPassword
   ```
3. Ingresar contraseña en la interfaz web
4. Seguir wizard de configuración inicial

### Paso 3: Crear un Nuevo Multibranch Pipeline

1. **Dashboard** → **Nueva tarea**
2. Seleccionar **Multibranch Pipeline**
3. Nombre: `school-guardian`
4. En **Branch Sources**, hacer clic en **Agregar fuente**:
   - Seleccionar **Git**
   - URL del repositorio: `https://github.com/tu-repo/school-guardian-project`
5. En **Descubrimiento de ramas**:
   - Seleccionar **Todas las ramas** (todas excepto PR)
   - O seleccionar **Solo ramas con nombre** y filtrar por `develop`, `main`, etc.
6. En **Script path**:
   - Dejar por defecto: `Jenkinsfile`
7. Guardar

### Paso 4: Configurar Credenciales

#### SonarQube Token

1. En **Confirugración** → **Credentiales**
2. **Agregar credential**
3. Tipo: **Texto secreto**
4. Secreto: `<tu-token-sonarqube>`
5. ID: `sonar-token`
6. Guardar

### Paso 5: Ejecutar el Pipeline

En un **Multibranch Pipeline**, los jobs se crean automáticamente para cada rama:

1. Jenkins detecta automáticamente todas las ramas en el repositorio
2. Por cada rama que tenga un `Jenkinsfile`, crea un job subordinado
3. Cada job subordinado aparece en el dashboard del Multibranch Pipeline
4. Para ejecutar manualmente:
   - Seleccionar la rama deseada (ej: `develop`, `main`)
   - Clic en **Construir ahora**
5. Para ejecución automática:
   - Hacer push a cualquier rama con Jenkinsfile
   - Jenkins detecta cambios automáticamente (si está configurado)
   - El pipeline se ejecuta sin intervención manual

**Ventajas del Multibranch Pipeline**:
- ✅ Detecta automáticamente nuevas ramas
- ✅ Elimina jobs cuando se elimina una rama
- ✅ Cada rama puede tener diferentes configuraciones
- ✅ Soporte para Pull Requests (PRs)

### Paso 6: Ver Resultados

En la vista del Multibranch Pipeline verás:
- 📊 **Resumen**: Lista de todas las ramas detectadas
- 📈 **Gráficos**: Histórico de builds exitosos/fallidos
- 🔄 **Scans**: Último escaneo de ramas

Por cada rama, el pipeline ejecutará:
- ✅ Detección de cambios (qué archivos cambiaron)
- ✅ Compilación backend (.NET)
- ✅ Análisis SonarQube backend
- ✅ Build frontend (Angular)
- ✅ Análisis SonarQube frontend
- ✅ Creación imágenes Docker (si es rama `develop`)

---

## Características del Multibranch Pipeline

### Gestión Automática de Ramas

El Multibranch Pipeline proporciona:

| Característica | Descripción |
|---|---|
| **Detección automática** | Escanea repositorio y detecta nuevas ramas |
| **Jobs subordinados** | Crea un job por rama que contiene Jenkinsfile |
| **Limpieza automática** | Elimina jobs cuando se elimina una rama |
| **Independencia de ramas** | Cada rama puede tener pipeline diferente |
| **PR Support** | Soporte nativo para Pull Requests |
| **Naming automático** | Jobs nombrados: `nombre-multibranch/rama` |

### Nombres de Jobs

```
school-guardian                    # Multibranch Pipeline
├── school-guardian/develop        # Job para rama develop
├── school-guardian/main           # Job para rama main
├── school-guardian/feature-x      # Job para rama feature-x
```

---

## Guía de Uso - SonarQube

### Paso 1: Acceder a SonarQube

1. Abrir navegador: `http://localhost:9000`
2. Credenciales por defecto:
   - Usuario: `admin`
   - Contraseña: `admin`
3. **IMPORTANTE**: Cambiar contraseña en primer acceso

### Paso 2: Generar Token de Análisis

1. Clic en **Create project** (esquina superior derecha)
2. **Manually**
3. Nombre: `guardian-school` o `guardian-token`
5. **Set up** y **copiar el token**
6. Este token se configura en Jenkins como `sonar-token`

### Paso 3: Interpretar Resultados

En el dashboard de cada proyecto verás:

- **Confiabilidad**: Bugs detectados
- **Seguridad**: Vulnerabilidades
- **Mantenibilidad**: Deuda técnica
- **Coverage**: Cobertura de tests
- **Duplicación**: Código duplicado

---

## Pipeline CI/CD

### Flujo del Jenkinsfile en Multibranch

```
                    ┌─────────────────────────────────┐
                    │  Git Push a cualquier rama      │
                    │  (develop, main, feature/*, ...) │
                    └────────────┬────────────────────┘
                                 │
                    ┌────────────▼─────────────┐
                    │  Multibranch Pipeline    │
                    │  Detecta cambios         │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────▼──────────────────────┐
                    │  Jenkins crea/actualiza job       │
                    │  para esa rama                    │
                    └────────────┬──────────────────────┘
                                 │
    ┌────────────────────────────┼────────────────────────────┐
    │                            │                            │
    ▼                            ▼                            ▼
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│rama: main   │         │rama: develop │         │rama: feature │
│             │         │              │         │/*            │
└─────┬───────┘         └──────┬───────┘         └──────┬───────┘
      │                        │                        │
      ▼                        ▼                        ▼
1. Detect Changes        1. Detect Changes       1. Detect Changes
2. Backend Build         2. Backend Build        2. Backend Build
3. Sonar Backend         3. Sonar Backend        3. Sonar Backend
4. Frontend Build        4. Frontend Build       4. Frontend Build
5. Sonar Frontend        5. Sonar Frontend       5. Sonar Frontend
                         6. Docker Build Back    
                         7. Docker Build Front   
                         (solo en develop)       
```

### Stages Detallados

#### 1. **Detect Changes**
- Compara HEAD con HEAD~1
- Detecta si cambiaron archivos en `dvlp-back/` o `dvlp-front/`
- Define variables de entorno `BUILD_BACK` y `BUILD_FRONT`

#### 2. **Backend**
```bash
# Condición: env.BUILD_BACK == 'true'
# Agente: Docker con imagen mcr.microsoft.com/dotnet/sdk:10.0

dotnet restore     # Descargar dependencias
dotnet build -c Release  # Compilar en Release
```

#### 3. **Sonar Backend**
```bash
# Condición: env.BUILD_BACK == 'true'

# Instalar herramienta de análisis
dotnet tool install --global dotnet-sonarscanner

# Iniciar análisis
dotnet sonarscanner begin \
  /k:"guardian-backend" \
  /d:sonar.host.url=http://sonarqube:9000 \
  /d:sonar.login=$SONAR_TOKEN

# Compilar
dotnet build -c Release

# Finalizar análisis (enviar resultados)
dotnet sonarscanner end /d:sonar.login=$SONAR_TOKEN
```

#### 4. **Frontend**
```bash
# Condición: env.BUILD_FRONT == 'true'
# Agente: Docker con imagen node:20

npm ci              # Instalar dependencias (CI mode)
npm run build       # Compilar Angular (AOT)
```

#### 5. **Sonar Frontend**
```bash
# Condición: env.BUILD_FRONT == 'true'

# Instalar scanner
npm install -g sonar-scanner

# Ejecutar análisis
sonar-scanner \
  -Dsonar.projectKey=guardian-frontend \
  -Dsonar.sources=src \
  -Dsonar.host.url=http://sonarqube:9000 \
  -Dsonar.login=$SONAR_TOKEN
```

#### 6. **Docker Build Backend**
```bash
# Condiciones: rama 'develop' AND BUILD_BACK == 'true'
# En Multibranch: branch 'develop' se detecta automáticamente

docker build -f Dockerfile \
  -t guardian-backend:${BUILD_NUMBER} \
  -t guardian-backend:latest \
  .
```

#### 7. **Docker Build Frontend**
```bash
# Condiciones: rama 'develop' AND BUILD_FRONT == 'true'
# En Multibranch: branch 'develop' se detecta automáticamente

docker build -f Dockerfile \
  -t guardian-frontend:${BUILD_NUMBER} \
  -t guardian-frontend:latest \
  .
```

### Comportamiento en Multibranch Pipeline

En un **Multibranch Pipeline**, Jenkins:

1. **Detecta automáticamente ramas**: Escanea el repositorio periódicamente
2. **Crea jobs subordinados**: Un job por rama con Jenkinsfile
3. **Gestiona ciclo de vida**:
   - Rama nueva → Crea job automáticamente
   - Rama eliminada → Elimina job automáticamente
4. **Ejecuta pipelines**:
   - Manualmente: Seleccionar rama → "Construir ahora"
   - Automáticamente: Via webhooks de Git o polling
5. **Variables de rama**:
   - `${BRANCH_NAME}`: Nombre de la rama actual
   - `${BUILD_NUMBER}`: Número de build
   - `${GIT_COMMIT}`: Hash del commit

**Configuración recomendada en Jenkinsfile**:
```groovy
when {
  allOf {
    branch 'develop'        // Solo en rama develop
    expression { env.BUILD_BACK == 'true' }
  }
}
```

Esto garantiza que Docker builds solo ocurran en la rama `develop`.

### Variables de Entorno

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `BUILD_BACK` | `true`/`false` | Se compiló backend |
| `BUILD_FRONT` | `true`/`false` | Se compiló frontend |
| `SONAR_TOKEN` | Credencial | Token de SonarQube |
| `BUILD_NUMBER` | Auto | Número secuencial del build |

---

## Dockerfiles

### Backend Dockerfile (Producción)

**Ruta**: `dvlp-back/src/backend/Dockerfile`

```dockerfile
# Etapa 1: Base runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080

# Etapa 2: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["backend.csproj", "."]
RUN dotnet restore "./backend.csproj" --no-cache
COPY . .
RUN dotnet publish "./backend.csproj" \
  -c $BUILD_CONFIGURATION \
  -o /app/publish \
  /p:UseAppHost=false

# Etapa 3: Final (muy pequeña)
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "backend.dll"]
```

**Características**:
- Multi-stage para imagen pequeña
- Port 8080 expuesto
- Configuración optimizada para producción

### Backend Dockerfile (Desarrollo)

**Ruta**: `dvlp-back/src/backend/dev.Dockerfile`

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:10.0
WORKDIR /src

# Copiar csproj (cachea dependencias)
COPY *.csproj ./
RUN dotnet restore

# Copiar todo y compilar
COPY . ./
RUN dotnet publish -c Release -o /app/publish

# Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 80
ENTRYPOINT ["dotnet", "backend.dll"]
```

**Para desarrollo real con hot-reload**, se usa volumen montado:
```yaml
volumes:
  - ./dvlp-back/src/backend:/app
command: dotnet watch run
```

### Frontend Dockerfile (Producción)

**Ruta**: `dvlp-front/dvlp-web/Dockerfile`

```dockerfile
# Etapa 1: Build
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx ng build --configuration spa --output-mode=static

# Etapa 2: Servir
FROM nginx:alpine AS final

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/school-guardian/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Características**:
- Compilación estática (SPA mode)
- Servido por Nginx (muy rápido)
- Multi-stage para imagen pequeña

### Frontend Dockerfile (Desarrollo)

**Ruta**: `dvlp-front/dvlp-web/dev.Dockerfile`

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Instalar Angular CLI
RUN npm install -g @angular/cli

COPY . .

# Servidor de desarrollo
CMD ["ng", "serve", "--host", "0.0.0.0"]
```

**Hot reload**: Volumen montado en compose
```yaml
volumes:
  - ./dvlp-front/dvlp-web:/app
  - /app/node_modules
```

### Jenkins Dockerfile

**Ruta**: `Dockerfile.jenkins`

```dockerfile
FROM jenkins/jenkins:2.555.1-lts-jdk25

USER root

RUN apt-get update && \
  apt-get install -y docker.io

USER jenkins
```

**Incluye**:
- Jenkins 2.555.1 (LTS)
- Docker CLI (para Docker-in-Docker)
- JDK 25 para pipeline groovy

---

## Comandos Útiles

### Iniciar Servicios

```bash
# Desarrollo (con hot reload)
docker-compose -f docker-compose.dev.yml up -d

# Solo Jenkins y SonarQube
docker-compose -f docker-compose.dev.yml up -d jenkins sonarqube nginx

# Producción
docker-compose -f docker-compose.yml up -d

# Reconstruir contenedores
docker-compose -f docker-compose.dev.yml up -d --build
```

### Ver Logs

```bash
# Jenkins
docker logs -f jenkins_container

# SonarQube
docker logs -f sonarqube

# Backend
docker logs -f backend-container-dev

# Frontend
docker logs -f frontend-container-dev

# Ver últimas 100 líneas
docker logs --tail=100 jenkins_container
```

### Acceso a Contenedores

```bash
# Bash en Jenkins
docker exec -it jenkins_container bash

# Bash en SonarQube
docker exec -it sonarqube bash

# Ver versión de .NET en backend
docker exec backend-container-dev dotnet --version

# Ver procesos en contenedor
docker exec jenkins_container ps aux
```

### Gestión de Volúmenes

```bash
# Listar volúmenes
docker volume ls

# Inspeccionar volumen
docker volume inspect school-guardian-project_jenkins_home

# Limpiar volúmenes no usados
docker volume prune

# Ver tamaño de volúmenes
docker system df
```

### Git y Pipeline

```bash
# Ver diferencias que disparan pipeline
git diff HEAD~1 HEAD --name-only

# Ver commits en rama develop
git log develop --oneline -10

# Ver archivos modificados en staging
git diff --name-only --cached
```

### Análisis de Calidad

```bash
# Forzar análisis manual en backend
docker exec backend-container-dev dotnet sonarscanner begin \
  /k:"guardian-backend" \
  /d:sonar.host.url=http://sonarqube:9000 \
  /d:sonar.login=<token>

# Forzar análisis manual en frontend
docker exec frontend-container-dev sonar-scanner \
  -Dsonar.projectKey=guardian-frontend \
  -Dsonar.sources=src \
  -Dsonar.host.url=http://sonarqube:9000 \
  -Dsonar.login=<token>
```

### Docker Compose Específicos

```bash
# Detener todos los servicios
docker-compose -f docker-compose.dev.yml down

# Detener y remover volúmenes
docker-compose -f docker-compose.dev.yml down -v

# Ver estado de servicios
docker-compose -f docker-compose.dev.yml ps

# Validar configuración
docker-compose -f docker-compose.dev.yml config

# Reconstruir solo Jenkins
docker-compose -f docker-compose.dev.yml up -d --build jenkins
```

### Troubleshooting

```bash
# Ver estadísticas de recursos
docker stats

# Ver inspect de contenedor
docker inspect jenkins_container

# Verificar conectividad entre contenedores
docker exec jenkins_container ping sonarqube

# Ver redes de Docker
docker network ls

# Inspeccionar red
docker network inspect school-guardian-project_sonar-net
```

---

## Guía de Mantenimiento

### Backup

```bash
# Backup Jenkins
docker run --volumes-from jenkins_container \
  -v $(pwd)/backup:/backup \
  alpine tar czf /backup/jenkins_backup.tar.gz -C /var/jenkins_home .

# Backup SonarQube
docker run --volumes-from sonarqube \
  -v $(pwd)/backup:/backup \
  alpine tar czf /backup/sonarqube_backup.tar.gz -C /opt/sonarqube/data .
```

### Actualizar Imágenes

```bash
# Actualizar Jenkins
docker pull jenkins/jenkins:2.555.1-lts-jdk25
docker-compose -f docker-compose.dev.yml up -d --build jenkins

# Actualizar SonarQube
docker pull sonarqube:lts
docker-compose -f docker-compose.dev.yml up -d --build sonarqube
```

### Limpiar Espacios

```bash
# Limpiar imágenes no usadas
docker image prune -a

# Limpiar contenedores detenidos
docker container prune

# Limpiar todo
docker system prune -a
```

---

## Referencias

- [Jenkins Multibranch Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/multibranch-pipeline-getting-started/)
- [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)
- [SonarQube Documentation](https://docs.sonarqube.org/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [.NET Docker Images](https://hub.docker.com/_/microsoft-dotnet)
- [Node.js Docker Images](https://hub.docker.com/_/node)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)

---

**Última actualización**: 4 de mayo de 2026  
**Mantenedor**: School Guardian Development Team
