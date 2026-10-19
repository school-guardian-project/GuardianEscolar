# AUDITORÍA TÉCNICA - SISTEMA GPS GUARDIAN ESCOLAR

**Fecha:** 14/10/2026  
**Auditor:** Subagente Autónomo de Investigación  
**Estado:** PARCIALMENTE

---

## 1. VEREDICTO FINAL

**PARCIALMENTE** - El sistema GPS está técnicamente implementado pero presenta desincronizaciones críticas que bloquean el seguimiento en tiempo real.

### Análisis:
- ✅ **Backend GPS**: Implementado correctamente en Spring Boot, servidor TCP funcionando, API REST disponible
- ✅ **App móvil**: Componentes GPS completos, polling cada 10 segundos, mapa funcional
- ❌ **Desincronización**: App móvil apunta al servicio incorrecto (sg-ms-gps:8084), no al gps-backend real
- ❌ **Inconsistencia de puertos**: Configuraciones divergentes entre backend y microservicio
- ❌ **IMEI hardcodeado**: No hay mecanismo para configurar IMEI dinámicamente

---

## 2. ARQUITECTURA REAL DEL SISTEMA GPS

### Backend GPS (gps-backend)
- **Lenguaje/Framework**: Java Spring Boot 4.1.1
- **Puerto TCP para VT03F**: 8842 (hardcodeado en `GpsTcpServer.java`)
- **Puerto HTTP REST**: 8080 (configurado en `application.properties`)
- **Formato de paquetes**: Protocolo VT03F con header `78 78`, soporta `0x01` (login), `0x13` (heartbeat), `0x31` (ubicación), `0x32` (alarma), `0x50` (LBS)
- **Almacenamiento**: Memoria (`ConcurrentHashMap`) - sin persistencia en BD
- **Implementación**: Servidor TCP multi-hilo, decoder de tramas, ACK con CRC-16

### Microservicio GPS (sg-ms-gps)
- **Lenguaje/Framework**: Java Spring Boot
- **Puerto HTTP REST**: 8080 (con mapeo a 8084 en Docker)
- **Puerto TCP**: 8842 (con mapeo en Docker)
- **Observación**: Este es un servicio duplicado/alternativo al gps-backend original

### Aplicación Móvil
- **Tecnología**: React Native con Expo
- **Framework de navegación**: React Navigation (Stack + Bottom Tabs)
- **Pantalla de seguimiento**: `LiveTracking.jsx` → `GpsMap.jsx` → `useGpsTracking.js`
- **Polling**: 10,000 ms (10 segundos) configurado en `gps.js`
- **Biblioteca de mapas**: `react-native-maps`

---

## 3. PROBLEMAS ENCONTRADOS

### Problema 1: URL Base Incorrecta en App Móvil
**Componente afectado**: App móvil (`src/core/config/gps.js`)
**Código evidenciador**:
```javascript
export const GPS_CONFIG = {
  baseUrl: "http://19.20.21.116:8084",  // ← Apunta a sg-ms-gps:8084
  imei: "355468590730586",
  pollingIntervalMs: 10000,
};
```

**Impacto**: La aplicación consulta el microservicio sg-ms-gps en puerto 8084, pero el backend real (gps-backend) escucha en puerto 8080. No hay coincidencia entre servicio consultado y servicio que recibe datos del VT03F.

### Problema 2: Puerto TCP Hardcodeado
**Componente afectado**: Backend GPS (`GpsTcpServer.java`)
**Código evidenciador**:
```java
private static final int PORT = 8842;  // ← Hardcodeado
```

**Impacto**: El puerto TCP no es configurable vía variables de entorno. Si hay conflicto con otros servicios, no se puede cambiar sin recompilar.

### Problema 3: IMEI Hardcodeado
**Componente afectado**: App móvil (`gps.js`) y Backend (pruebas)
**Código evidenciador**:
```javascript
imei: "355468590730586",  // ← IMEI fijo
```

**Impacto**: Solo funciona con un dispositivo específico. No hay mecanismo para configurar IMEI dinámicamente por vehículo/estudiante.

### Problema 4: Servicios Duplicados Inconsistente
**Componentes afectados**: gps-backend vs sg-ms-gps
**Evidencia**:
- `gps-backend`: Puerto 8080, implementación completa
- `sg-ms-gps`: Puerto 8084 (mapeado desde 8080), docker-compose.yml expone puertos
- La app usa sg-ms-gps (8084), pero la documentación sugiere gps-backend (8080)

**Impacto**: Confusión sobre cuál servicio debe ejecutarse y recibir datos del VT03F.

### Problema 5: Falta de Autenticación en Endpoints REST
**Componente afectado**: Backend GPS (`GpsLocationController.java`)
**Código evidenciador**:
```java
@GetMapping("/devices/{imei}/location")
public GpsLocation getLatestLocation(@PathVariable String imei) {
    return gpsLocationService.getLatest(imei);
}
```

**Impacto**: Cualquier persona con acceso a la red puede consultar ubicaciones sin autenticación.

### Problema 6: Manejo de Memoria Sin Persistencia
**Componente afectado**: `GpsLocationService.java`
**Código evidenciador**:
```java
private final Map<String, GpsLocation> locations = new ConcurrentHashMap<>();
```

**Impacto**: Si el servicio se reinicia, se pierden todas las ubicaciones. No hay persistencia en base de datos.

---

## 4. COMPONENTES QUE FUNCIONAN

### ✅ Servidor TCP del Backend
- Inicia correctamente en puerto 8842
- Reconstruye tramas TCP fragmentadas (`GpsFrameDecoder`)
- Maneja múltiples protocolos VT03F (`0x01`, `0x13`, `0x31`, `0x32`, `0x50`)
- Envía ACK con CRC-16 correctamente
- Registra conexiones por IMEI

### ✅ Parser de Paquetes GPS
- Decodifica correctamente ubicaciones (`0x31`): latitud, longitud, velocidad, curso
- Parsea fechas GPS a zona horaria Colombia
- Detecta tipo de posición (REAL_TIME vs RE_UPLOAD)
- Maneja alarmas (`0x32`) y datos LBS (`0x50`)

### ✅ API REST del Backend
- Endpoint `/api/gps/devices/{imei}/location` devuelve formato JSON correcto
- Estructura de respuesta coincide con lo esperado por la app:
  ```json
  {
    "imei": "355468590730586",
    "latitude": 2.9273,
    "longitude": -75.2819,
    "speed": 0.0,
    "course": 0.0,
    "dateTime": "2026-09-22T08:20:41-05:00",
    "status": "ACTIVE",
    "positionType": "UNKNOWN"
  }
  ```

### ✅ App Móvil - Componentes GPS
- Hook `useGpsTracking.js`: Polling cada 10s con cleanup correcto
- Componente `GpsMap.jsx`: Mapa funcional con marcador animado
- Servicio `GpsService.js`: Manejo de errores de red y validación
- Pantalla `LiveTracking.jsx`: UI completa con información de velocidad y estado

### ✅ Pruebas Unitarias
- 17 pruebas ejecutadas exitosamente
- Cobertura: parser de ubicaciones, alarmas, LBS, ACK, frame decoder
- Tests validan escenarios reales de paquetes VT03F

---

## 5. PUERTOS Y URLs REALES

| Componente | Puerto TCP | Puerto HTTP | URL en app | Estado |
|------------|------------|-------------|------------|--------|
| **gps-backend** | 8842 | 8080 | NO USADA | ✅ Implementado |
| **sg-ms-gps** | 8842 (mapeado) | 8084 (de 8080) | `http://19.20.21.116:8084` | ⚠️ Referenciado |
| **App móvil config** | - | - | `http://19.20.21.116:8084` | ❌ Apunta al servicio incorrecto |

**Coincidencia**: NO - La app apunta a sg-ms-gps:8084, pero no hay garantía de que ese servicio esté ejecutándose o reciba datos del VT03F.

---

## 6. IMEI EN EL SISTEMA

### Backend GPS
- **Identificación**: Extrae IMEI del paquete `0x01` (login)
- **Registro**: `GpsDeviceService.registerDevice()` almacena en memoria
- **Consulta**: Endpoint `/api/gps/devices/{imei}/location` busca por IMEI

### App Móvil
- **IMEI usado**: `"355468590730586"` (hardcodeado en `gps.js`)
- **Origen**: No configurable, viene del archivo de configuración
- **Consulta**: `getCurrentVehicleLocation(imei)` usa este IMEI fijo

### Inconsistencia
- Backend puede recibir paquetes de cualquier IMEI que se conecte
- App solo consulta por IMEI `355468590730586`
- Si el VT03F físico tiene IMEI diferente, la app no verá sus ubicaciones

---

## 7. CORRECCIONES NECESARIAS (Prioridad)

### ALTA PRIORIDAD (Bloquean seguimiento)

1. **Corregir URL en app móvil** (`gps.js`)
   - Cambiar `baseUrl` de `http://19.20.21.116:8084` a `http://19.20.21.116:8080`
   - O ejecutar gps-backend en puerto 8084 en lugar de 8080

2. **Unificar servicios GPS**
   - Decidir cuál servicio usar: gps-backend O sg-ms-gps
   - Eliminar o desactivar el servicio no usado
   - Actualizar docker-compose.yml principal si es necesario

3. **Configurar IMEI dinámicamente**
   - Obtener IMEI del vehículo/estudiante desde API principal
   - Hacer `gps.js` configurable por entorno
   - Agregar pantalla de configuración en app

### MEDIA PRIORIDAD (Mejoran robustez)

4. **Hacer puerto TCP configurable**
   - Mover `PORT = 8842` a `application.properties`
   - Usar `@Value("${gps.tcp.port}")` en `GpsTcpServer`

5. **Agregar autenticación a endpoints REST**
   - Validar token JWT en controladores GPS
   - Restringir acceso a ubicaciones por usuario/rol

6. **Agregar persistencia en BD**
   - Activar configuración JPA/SQL Server (ya en pom.xml)
   - Implementar repositorios para `GpsLocation` y `GpsDevice`

### BAJA PRIORIDAD (Mejoran mantenimiento)

7. **Reemplazar System.out por logger SLF4J**
8. **Agregar validación de CRC en paquetes recibidos**
9. **Implementar ThreadPool para conexiones TCP**
10. **Agregar health checks y métricas**

---

## 8. LO QUE NO SE PUDO VERIFICAR

### Dependencias de entorno físico
- **VT03F físico**: No disponible para pruebas de conexión real
- **Conexión SIM**: Requiere chip con datos activos
- **Señal GPS**: Depende de satélites y ubicación
- **Red móvil**: Requiere cobertura de operador

### Configuración de red
- **Firewall**: Puertos 8842 (TCP) y 8080/8084 (HTTP) deben estar abiertos
- **NAT/Enrutamiento**: IP pública accesible desde internet para el VT03F
- **DNS**: No hay configuración de nombre de dominio

### Integración con sistema principal
- **API Gateway Kong**: No verificado si enruta tráfico a GPS
- **Autenticación central**: No verificado si tokens JWT funcionan con GPS
- **Base de datos compartida**: No verificado esquema de persistencia

---

## 9. INSTRUCCIONES PARA LA PRUEBA FÍSICA

### Preparación del Entorno

1. **Servicios a iniciar**:
   ```bash
   # Opción A: Usar gps-backend original
   cd "c:\Users\ROJAS\Desktop\ADSO\Guardian Escolar\gps-backend\gps-backend"
   ./mvnw spring-boot:run
   
   # Opción B: Usar sg-ms-gps (requiere Docker)
   cd "c:\Users\ROJAS\Desktop\ADSO\sg-ms-gps"
   docker-compose up -d
   ```

2. **Verificar servicios activos**:
   - TCP puerto 8842: `netstat -an | findstr :8842`
   - HTTP puerto 8080/8084: `curl http://localhost:8080/api/gps/devices/test/connected`

3. **Configurar app móvil**:
   - Editar `src/core/config/gps.js`
   - Ajustar `baseUrl` a IP LAN del servidor (ej: `http://192.168.1.100:8080`)
   - Verificar IMEI coincide con dispositivo físico

### Prueba con VT03F Físico

4. **Configurar dispositivo VT03F**:
   - IP servidor: `19.20.21.116` (o IP LAN del equipo)
   - Puerto TCP: `8842`
   - Frecuencia reporte: 10-30 segundos

5. **Verificar recepción en backend**:
   - Observar logs Spring Boot: `GPS TCP SERVER INICIADO`
   - Mensaje: `GPS conectado desde: ...`
   - Logs de ubicación: `Ubicación guardada como REAL_TIME para {IMEI}`

6. **Verificar API REST**:
   ```bash
   curl http://localhost:8080/api/gps/devices/{IMEI_REAL}/location
   ```
   - Debe devolver JSON con coordenadas actuales
   - Timestamp debe ser reciente (últimos 30 segundos)

7. **Probar app móvil**:
   - Abrir pantalla LiveTracking desde MainPage
   - Verificar que se actualice cada 10 segundos
   - Marcador debe moverse en mapa con nuevas coordenadas

### Señales de Funcionamiento Correcto

✅ **Backend recibe datos**:
- Logs muestran `Ubicación guardada` periódicamente
- Endpoint REST devuelve coordenadas con timestamp reciente

✅ **App muestra movimiento**:
- Marcador se actualiza en mapa cada 10 segundos
- Velocidad y hora de actualización cambian
- No hay errores de red en consola

✅ **Flujo completo**:
1. VT03F → TCP:8842 → Backend GPS → Memoria
2. App → HTTP:8080 → Backend GPS → JSON → Mapa

### Qué Hacer Si Falla

🔴 **Backend no recibe conexiones**:
- Verificar firewall (puerto 8842 abierto)
- Confirmar IP pública accesible desde internet
- Revisar logs Spring Boot por errores

🔴 **App no obtiene ubicaciones**:
- Verificar URL base en `gps.js`
- Probar endpoint REST directamente con curl
- Revisar IMEI coincide con dispositivo

🔴 **Ubicaciones desactualizadas**:
- Verificar frecuencia de reporte en VT03F
- Revisar señal GPS/satélites del dispositivo
- Confirmar que el backend guarda ubicaciones nuevas

---

## CONCLUSIÓN TÉCNICA

El sistema GPS de Guardian Escolar está **técnicamente implementado** pero **operacionalmente bloqueado** por desincronizaciones críticas:

1. **Implementación correcta**: Backend Spring Boot con servidor TCP funcional, parser VT03F completo, API REST válida
2. **App móvil funcional**: Componentes GPS bien estructurados, polling adecuado, UI completa
3. **Bloqueo principal**: App consulta servicio incorrecto (sg-ms-gps:8084) en lugar del backend real (gps-backend:8080)
4. **Configuración rígida**: IMEI hardcodeado, puertos no configurables

**Estimación de esfuerzo para corregir**: 2-4 horas de desarrollo para:
- Unificar configuración de servicios
- Hacer IMEI configurable
- Corregir URLs en app móvil

Una vez corregidas estas inconsistencias, el sistema debería funcionar para seguimiento en tiempo real del VT03F instalado en la moto.