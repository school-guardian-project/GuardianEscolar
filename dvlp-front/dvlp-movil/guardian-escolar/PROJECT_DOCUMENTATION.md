# Documentación del proyecto Guardian Escolar

> Estado revisado: 23 de julio de 2026.

Guardian Escolar es una aplicación móvil construida con React Native y Expo. Su interfaz está orientada a familias o acudientes: permite iniciar sesión, recuperar el acceso, consultar una ruta escolar en un mapa y administrar información y opciones del perfil.

Esta versión reemplaza la documentación anterior. Las pantallas que antes se indicaban como ausentes ya están implementadas dentro de `src/features`, y ahora se documentan junto con los módulos de perfil, soporte y calificación recientemente incorporados.

## 1. Tecnologías principales

| Tecnología | Uso en el proyecto |
| --- | --- |
| Expo SDK 54 | Entorno de desarrollo, ejecución y configuración multiplataforma. |
| React 19 y React Native 0.81 | Construcción de las vistas y la interfaz móvil. |
| React Navigation 7 | Navegación entre pantallas y barra inferior. |
| `react-native-maps` | Mapa de la ruta escolar en la pantalla principal. |
| `expo-location` | Dependencia preparada para obtener ubicación; todavía no se consume en el código actual. |
| `@expo/vector-icons` | Iconos de perfil, navegación y acciones. |
| i18next / react-i18next | Textos en español, inglés, francés y portugués. |
| TypeScript | Disponible para algunas vistas y para las comprobaciones del editor; el proyecto mezcla archivos `.js`, `.jsx` y `.tsx`. |

## 2. Ejecución del proyecto

Instalar dependencias y ejecutar uno de los siguientes comandos:

```bash
npm install
npm start
npm run android
npm run ios
npm run web
```

- `npm start` abre el servidor de Expo.
- `npm run android`, `npm run ios` y `npm run web` solicitan a Expo abrir el destino correspondiente.
- La configuración de Expo está en `app.json`: la aplicación se llama y se identifica como `guardian-escolar`, usa orientación vertical y tiene iconos, pantalla de carga y ajustes para Android, iOS y web.

## 3. Organización del código

```text
guardian-escolar/
├── App.js                         # Navegación raíz y proveedores globales
├── index.js                       # Registro de la aplicación en Expo
├── app.json                       # Configuración de Expo
├── assets/                        # Iconos, splash y favicon
└── src/
    ├── components/                 # Componentes visuales reutilizables
    │   ├── buttons/
    │   ├── cards/
    │   ├── inputs/
    │   └── layout/
    ├── core/                       # Servicios y recursos compartidos
    │   ├── constants/
    │   ├── hooks/
    │   ├── i18n/
    │   ├── services/
    │   └── styles/
    └── features/                   # Pantallas agrupadas por funcionalidad
        ├── auth/
        ├── home/
        └── profile/
```

La estructura sigue una separación por funcionalidades: una pantalla nueva debe pertenecer a su dominio en `src/features`; si una pieza de interfaz puede reutilizarse, debe ir en `src/components`; y la configuración global se concentra en `src/core`.

Los alias definidos en `babel.config.js` y `tsconfig.json` evitan rutas largas:

- `@components/...` apunta a `src/components/...`.
- `@features/...` apunta a `src/features/...`.
- `@core/...` apunta a `src/core/...`.
- `@assets/...` apunta a `assets/...`.

## 4. Arranque, tema y navegación

`index.js` registra `App.js` como componente raíz de Expo. A continuación, `App.js` realiza tres tareas globales:

1. Importa `src/core/i18n/i18n` para inicializar los textos traducibles.
2. Envuelve toda la aplicación con `ThemeProvider`, que proporciona el tema activo.
3. Crea un `NavigationContainer` con un navegador de pila (`Stack.Navigator`).

La primera pantalla es `Login`. Desde ella se accede al flujo de recuperación de contraseña y a las pantallas principales. Las rutas registradas actualmente son:

| Ruta | Componente | Propósito |
| --- | --- | --- |
| `Login` | `features/auth/views/Login/Login` | Inicio de sesión visual. |
| `ForgotPassword` | `features/auth/views/ForgotPassword/ForgotPassword` | Solicitud de código de recuperación. |
| `VerifyCode` | `features/auth/views/VerifyCode/VerifyCode` | Verificación del código de seis dígitos. |
| `NewPassword` | `features/auth/views/NewPassword/NewPassword` | Creación de una contraseña nueva. |
| `MainPage` | `features/home/views/MainPage/MainPage` | Mapa y datos resumidos de una ruta. |
| `Profile` | `features/profile/views/Profile/Profile` | Menú de perfil. |
| `Datas`, `Family`, `Security` | Vistas de perfil correspondientes | Datos personales, familia y seguridad. |
| `PrivacyPolicies`, `AboutUs`, `Logout` | Vistas de perfil correspondientes | Información legal, institucional y cierre de sesión. |
| `Support`, `Rating` | Subvistas de “Acerca de” | Formulario de soporte y calificación. |
| `HomeTabs` | Navegador de pestañas | Contenedor alternativo con rutas y perfil. |

`HomeTabs` contiene las pestañas `MainPage` y `Profile`; sin embargo, el flujo actual navega directamente a `MainPage` después del inicio de sesión. La barra visual reutilizable `BottomTabBar` también permite moverse entre mapa y perfil.

## 5. Módulos funcionales

### Autenticación

Las pantallas están en `src/features/auth/views`.

- **Login:** controla en memoria los valores de correo y contraseña. El enlace “Olvidé mi contraseña” dirige a `ForgotPassword`; el botón de ingresar dirige a `MainPage`.
- **ForgotPassword:** recibe un correo y avanza a `VerifyCode`.
- **VerifyCode:** muestra `CodeInput`, un conjunto de seis campos numéricos, y avanza a `NewPassword`.
- **NewPassword:** permite escribir y confirmar una nueva contraseña; al finalizar vuelve a `Login`.

Este flujo es de interfaz: no hay todavía validación de credenciales, consumo de API, envío real de códigos ni persistencia de contraseñas.

### Inicio y ruta escolar

`src/features/home/views/MainPage/MainPage.jsx` presenta un `MapView` centrado inicialmente en Neiva, Huila (coordenadas `2.9273, -75.2819`). Sobre el mapa muestra:

- `SearchInput`, para escribir una búsqueda de ruta.
- `NotificationButton`, botón visual de notificaciones.
- `RouteInfoCard`, resumen estático de una ruta, conductor, placa, horario, paradas y destino.
- `BottomTabBar`, barra inferior para las secciones de ruta, ubicación y perfil.

El hook `useWindow` usa `useWindowDimensions` para ajustar el espaciado horizontal según el ancho de la pantalla. `useSafeAreaInsets` evita que la barra superior quede debajo de la zona segura del dispositivo.

### Perfil

La pantalla `Profile` ofrece accesos a seis secciones:

- **Datos (`Datas`):** muestra teléfono, correo, contraseña, dirección, ciudad y colegio como datos de ejemplo.
- **Familia (`Family`):** organiza titular y miembros de la familia en tarjetas informativas.
- **Seguridad (`Security`):** incluye un interruptor local para notificaciones y un acceso visual para cambiar contraseña.
- **Políticas de privacidad (`PrivacyPolicies`):** muestra secciones expandibles sobre permisos, datos, protección, autenticación, accesos y derechos.
- **Acerca de (`AboutUs`):** contiene información institucional desplegable y accesos a soporte y calificación.
- **Cerrar sesión (`Logout`):** ofrece confirmación visual; la acción actual vuelve a `Login`.

Las vistas `Support` y `Rating` son los cambios más recientes. Ambas incluyen un área de texto; `Rating` añade una selección local de una a cinco estrellas. El botón de enviar es un marcador de posición y aún no transmite datos a un servicio.

## 6. Componentes reutilizables

| Grupo | Componentes | Responsabilidad |
| --- | --- | --- |
| Botones | `PrimaryButton`, `BackButton`, `NotificationButton` | Acciones principales, regreso seguro en la pila y notificaciones. |
| Entradas | `InputField`, `CodeInput`, `SearchInput`, `SettingsItem` | Campos de formulario, código, búsqueda y enlaces del perfil. |
| Tarjetas | `InfoCard`, `InfoRow`, `ExpandedSection`, `RouteInfoCard` | Agrupación de datos, filas informativas, acordeones y resumen de ruta. |
| Diseño | `BottomTabBar` | Navegación inferior visual con iconos. |

`BackButton` comprueba si existe una pantalla anterior. Si no puede retroceder, lleva al usuario a `Login`, evitando dejar la vista sin salida. `InfoCard` e `InfoRow` forman el patrón común de las pantallas de perfil; `ExpandedSection` conserva internamente si una sección está abierta o cerrada.

## 7. Tema y estilos

`src/core/constants/Colors.js` define ocho temas: cuatro claros (`lightBlue`, `lightGreen`, `lightYellow`, `lightRed`) y cuatro oscuros equivalentes. El tema inicial es `lightBlue`.

`ThemeService.js` expone:

- `ThemeProvider`, que almacena el nombre del tema activo.
- `useTheme()`, hook para leer `theme`, `themeName` y `changeTheme(name)` desde cualquier componente hijo.

Cada pantalla combina estilos estáticos de `StyleSheet.create()` con colores del tema, por ejemplo `theme.bgColor`, `theme.textColor`, `theme.cardSecondaryBg` y `theme.borderColor`. Los estilos comunes del perfil están en `src/core/styles/profileScreen.style.jsx`; los estilos particulares permanecen junto a cada pantalla.

## 8. Internacionalización

`src/core/i18n/i18n.js` registra los archivos `es.json`, `en.json`, `fr.json` y `pt.json`. El idioma inicial y de respaldo es español (`es`).

Los componentes llaman a `useTranslation()` y usan `t("clave")` en lugar de escribir textos directamente. Las traducciones ahora incluyen los textos del módulo de perfil, políticas, soporte y calificación. Para agregar una frase nueva:

1. Añadir la misma clave a los cuatro archivos de idioma.
2. Consumirla mediante `t("grupo.clave")`.
3. Verificar que no falte en ninguno de los idiomas para que la interfaz mantenga consistencia.

## 9. Estado actual y pendientes técnicos

La aplicación ya incluye las vistas de autenticación, mapa y perfil, pero varias acciones todavía son demostrativas. Antes de una versión productiva se deben conectar los formularios con la API, validar los datos y almacenar el estado necesario.

También conviene resolver estos puntos detectados en el código actual:

- En `MainPage`, el callback `onLocationPress` que se envía a `BottomTabBar` usa `navigation.navigate(...)`, pero `navigation` no está declarado en esa pantalla. La barra ya navega por cuenta propia para ruta y perfil; la acción de ubicación requiere una pantalla `Location` registrada o una estrategia distinta.
- `Support` y `Rating` usan propiedades de tema como `bgcolor` y `cardBackground`, mientras el tema define `bgColor` y `cardBg`. Esto puede impedir que se apliquen los colores esperados.
- En `profileScreen.style.jsx` hay una clave `button` duplicada; la segunda sobrescribe la primera. Debe conservarse una única definición si se ajustan esos estilos.
- `InfoRow` recibe las propiedades `arrow` y `hidden`, pero aún no las representa ni modifica el valor mostrado. Son puntos preparados para completar la interfaz.
- Los datos de ruta, perfil y familia son valores de ejemplo. No están vinculados a usuario, ubicación ni base de datos.

## Principio DRY (Don't Repeat Yourself)

## 10. Resumen

Guardian Escolar cuenta ahora con una base de interfaz completa para autenticación, consulta de ruta y gestión de perfil. La arquitectura separa pantallas, componentes compartidos y servicios globales; el tema y las traducciones se aplican de forma transversal. El siguiente paso natural es reemplazar los datos simulados y las acciones de navegación incompletas por flujos conectados a los servicios reales del proyecto.
