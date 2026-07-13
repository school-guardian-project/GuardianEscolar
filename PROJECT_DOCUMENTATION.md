# Documentación del proyecto Guardian Escolar

Este documento explica la estructura del proyecto y los archivos disponibles en el workspace actual.

> Nota: `App.js` importa pantallas bajo `src/features/auth/views`, `src/features/home/views` y `src/features/profile/views`, pero esos archivos no están presentes en el workspace actual. La documentación describe los archivos disponibles.

## Metodología de arquitectura

La aplicación usa una organización cercana a Feature-Sliced Design (FSD). En este enfoque:

- Cada ``slice`` o característica se coloca en `src/features/`.
- `src/components/` contiene bloques de interfaz reutilizables.
- `src/core/` contiene lógica compartida, temas y traducciones.

Aunque no es un FSD completo al 100%, el proyecto sí separa claramente:

- `features/` para funciones específicas,
- `components/` para UI y elementos visuales,
- `core/` para configuración global y servicios.

Esta separación facilita mantener el código ordenado y entender qué pertenece a cada parte de la app.

---

## 1. Estructura general del proyecto

Carpetas principales:

- `src/`: Código fuente de la aplicación.
- `src/components/`: Componentes reutilizables de interfaz.
- `src/core/`: Código compartido, temas y traducciones.
- `assets/`: Archivos multimedia como iconos y splash.

Archivos principales en la raíz:

- `package.json`: dependencias y comandos del proyecto.
- `babel.config.js`: configuración de Babel y alias de importación.
- `tsconfig.json`: configuración de TypeScript.
- `index.js`: punto de entrada de Expo.
- `App.js`: componente raíz y navegación.
- `app.json`: configuración de Expo.

---

## 2. Archivos raíz

### `package.json`

Este archivo define cómo se ejecuta la aplicación y qué librerías usa.

```json
{
  "name": "guardian-escolar",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@react-navigation/bottom-tabs": "^7.18.8",
    "@react-navigation/native": "^7.3.8",
    "@react-navigation/stack": "^7.10.11",
    "expo": "~54.0.34",
    "expo-status-bar": "~3.0.9",
    "i18next": "^26.3.6",
    "react": "19.1.0",
    "react-i18next": "^17.0.9",
    "react-native": "0.81.5",
    "react-native-maps": "1.20.1",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0"
  },
  "private": true,
  "devDependencies": {
    "babel-plugin-module-resolver": "^5.0.3",
    "typescript": "~5.9.2"
  }
}
```

Explicación:

- `name`, `version`, `main`: identifican el proyecto.
- `scripts`: comandos que usas con `npm run ...`.
- `dependencies`: librerías necesarias en producción.
- `devDependencies`: herramientas para desarrollo.

### `babel.config.js`

Define cómo Babel transforma el código y permite alias de rutas.

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@components': './src/components',
            '@features': './src/features',
            '@core': './src/core',
            '@assets': './assets',
          },
        },
      ],
    ],
  };
};
```

Explicación:

- `api.cache(true)`: guarda la configuración en caché.
- `presets`: usa el preset de Expo para React Native.
- `plugins.module-resolver`: asigna accesos directos a carpetas.
- `alias`: permite importar más corto.

### `tsconfig.json`

Configuración de TypeScript y alias para el editor.

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@features/*": ["src/features/*"],
      "@core/*": ["src/core/*"],
      "@assets/*": ["assets/*"]
    }
  }
}
```

Explicación:

- `extends`: hereda configuración base de Expo.
- `strict`: activa comprobaciones estrictas para evitar errores.
- `baseUrl`: raíz del proyecto.
- `paths`: alias que coinciden con `babel.config.js`.

### `app.json`

Configuración de Expo para estilos visuales y plataformas.

```json
{
  "expo": {
    "name": "guardian-escolar",
    "slug": "guardian-escolar",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

Explicación:

- `orientation`: fija pantalla vertical.
- `userInterfaceStyle`: indica estilo claro.
- `splash`: imagen y color de la pantalla de carga.
- `ios`, `android`, `web`: ajustes específicos por plataforma.

### `index.js`

Punto de entrada que conecta Expo con `App`.

```js
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
```

Explicación:

- `registerRootComponent(App)`: carga `App` como componente principal.
- Este archivo no necesita más lógica; Expo lo usa para iniciar la app.

### `App.js`

Aquí se define la navegación global y se habilita el tema.

```js
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Importaciones de pantallas 
import Welcome from './src/features/auth/views/Welcome';
import ForgotPassword from './src/features/auth/views/ForgotPassword';
import VerifyCode from './src/features/auth/views/VerifyCode';
import NewPassword from './src/features/auth/views/NewPassword';
import MainPage from './src/features/home/views/MainPage';
import Profile from './src/features/profile/views/Profile';
import './src/core/i18n/i18n';
import { ThemeProvider } from './src/core/services/ThemeService';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="MainPage" 
        component={MainPage}
        options={{ tabBarLabel: 'Rutas', tabBarIcon: () => <Text>🚌</Text> }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{ tabBarLabel: 'Perfil', tabBarIcon: () => <Text>🧍</Text> }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Welcome"
          screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={Welcome}/>
          <Stack.Screen name="ForgotPassword" component={ForgotPassword}/>
          <Stack.Screen name="VerifyCode" component={VerifyCode}/>
          <Stack.Screen name="NewPassword" component={NewPassword}/>
          <Stack.Screen name="HomeTabs" component={HomeTabs}/>
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
```

Explicación detallada:

- `NavigationContainer`: envuelve toda la navegación. Es obligatorio cuando usas React Navigation.
- `createStackNavigator()`: crea una navegación en pila donde una pantalla empuja a la siguiente.
- `createBottomTabNavigator()`: crea una navegación con pestañas inferiores.
- `HomeTabs()`: define una pantalla con dos pestañas fijas.
  - `MainPage`: pantalla principal de rutas.
  - `Profile`: pantalla de perfil.
  - Cada pestaña muestra un emoji como icono.
- `ThemeProvider`: envuelve la app para proveer colores desde todos los componentes.
- `Stack.Navigator`: lista de pantallas de login y flujo principal.
  - `initialRouteName="Welcome"`: la primera pantalla que se ve.
  - `headerShown: false`: oculta barras de navegación automáticas.
- Las pantallas de `auth`, `home` y `profile` no están en el workspace actual.

---

## 3. `src/core`: tema y traducciones

### `src/core/services/ThemeService.js`

Este archivo define el tema global de colores.

```js
import { useState, createContext, useContext } from 'react';
import { themes, defaultTheme } from '../constants/Colors';

export const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState(defaultTheme);
  const theme = themes[themeName];

  const changeTheme = (name) => {
    if (themes[name]) setThemeName(name);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

Explicación línea por línea:

- `useState, createContext, useContext`: funciones de React para estado y contexto.
- `themes, defaultTheme`: importan los colores desde `Colors.js`.
- `ThemeContext = createContext()`: crea un espacio global para el tema.
- `useTheme()`: hook que devuelve el valor actual del tema.
- `ThemeProvider({ children })`: componente que envuelve la app.
  - `themeName`: nombre del tema activo.
  - `theme`: objeto de colores actual.
  - `changeTheme(name)`: cambia el tema si existe.
  - `ThemeContext.Provider`: provee `theme`, `themeName` y `changeTheme` a los hijos.

### `src/core/constants/Colors.js`

Define todos los temas disponibles.

```js
export const themes = {
  lightBlue: {
    bgColor: '#F0F4F8',
    textColor: '#111827',
    navbarColor: '#1A56DB',
    cardBg: '#FFFFFF',
    cardSecondaryBg: '#F8FAFC',
    cardColorInput: '#858e9b',
    borderColor: '#E2E8F0',
    textSecondary: '#64748B',
    titleColor: '#1A2E4A',
    hoverColor: '#2061ec',
    accentColor: '#003ab8',
    alertBg: '#FEF2F2',
    alertTitle: '#7F1D1D',
    alertText: '#374151',
    alertIcon: '#DC2626',
    modalBg: '#FFFFFF',
    iconColor: '#164bb4',
    borderIcon: '#001c41',
    buttonCancel: '#FFFFFF',
    buttonApply: '#1A56DB',
    inputBg: '#FFFFFF',
    inputBorder: '#CBD5E1',
  },
  lightGreen: {
    bgColor: '#F0F4F8',
    textColor: '#111827',
    navbarColor: '#16A34A',
    cardBg: '#FFFFFF',
    cardSecondaryBg: '#F8FAFC',
    cardColorInput: '#858e9b',
    borderColor: '#E2E8F0',
    textSecondary: '#64748B',
    titleColor: '#1A2E4A',
    hoverColor: '#16A34A',
    accentColor: '#107936',
    alertBg: '#FEF2F2',
    alertTitle: '#7F1D1D',
    alertText: '#374151',
    alertIcon: '#DC2626',
    modalBg: '#FFFFFF',
    iconColor: '#12813b',
    borderIcon: '#0b3d1e',
    buttonCancel: '#FFFFFF',
    buttonApply: '#16A34A',
    inputBg: '#FFFFFF',
    inputBorder: '#CBD5E1',
  },
  lightYellow: {
    bgColor: '#FAF8F1',
    textColor: '#1F2937',
    navbarColor: '#D4A017',
    cardBg: '#FFFFFF',
    cardSecondaryBg: '#F8F3E6',
    cardColorInput: '#737B88',
    borderColor: '#E7D7A5',
    textSecondary: '#6B7280',
    titleColor: '#4B3A12',
    hoverColor: '#B7791F',
    accentColor: '#A16207',
    alertBg: '#FEF2F2',
    alertTitle: '#7F1D1D',
    alertText: '#374151',
    alertIcon: '#DC2626',
    modalBg: '#FFFFFF',
    iconColor: '#B7791F',
    borderIcon: '#8B5E00',
    buttonCancel: '#FFFFFF',
    buttonApply: '#D4A017',
    inputBg: '#FFFFFF',
    inputBorder: '#D1C07A',
  },
  lightRed: {
    bgColor: '#F8F4F4',
    textColor: '#1F2937',
    navbarColor: '#B42318',
    cardBg: '#FFFFFF',
    cardSecondaryBg: '#FAFAFA',
    cardColorInput: '#7C8593',
    borderColor: '#E5E7EB',
    textSecondary: '#6B7280',
    titleColor: '#4A1D1F',
    hoverColor: '#C53030',
    accentColor: '#991B1B',
    alertBg: '#FEF2F2',
    alertTitle: '#7F1D1D',
    alertText: '#374151',
    alertIcon: '#DC2626',
    modalBg: '#FFFFFF',
    iconColor: '#B91C1C',
    borderIcon: '#7F1D1D',
    buttonCancel: '#FFFFFF',
    buttonApply: '#B42318',
    inputBg: '#FFFFFF',
    inputBorder: '#E5C5C5',
  },
  darkBlue: {
    bgColor: '#0F1115',
    textColor: '#E5E7EB',
    navbarColor: '#0F2E6B',
    cardBg: '#161A22',
    cardSecondaryBg: '#1C1F26',
    cardColorInput: '#bcbcbc',
    borderColor: '#252A34',
    textSecondary: '#6B7280',
    titleColor: '#F9FAFB',
    hoverColor: '#3B82F6',
    accentColor: '#3B82F6',
    alertBg: '#161A22',
    alertTitle: '#FCA5A5',
    alertText: '#D1D5DB',
    alertIcon: '#F87171',
    modalBg: '#161A22',
    iconColor: '#164bb4',
    borderIcon: '#0025cc',
    buttonCancel: '#FFFFFF',
    buttonApply: '#3B82F6',
    inputBg: '#0D1117',
    inputBorder: '#252A34',
  },
  darkGreen: {
    bgColor: '#0F1115',
    textColor: '#E5E7EB',
    navbarColor: '#0B4A24',
    cardBg: '#161A22',
    cardSecondaryBg: '#1C1F26',
    cardColorInput: '#bcbcbc',
    borderColor: '#252A34',
    textSecondary: '#6B7280',
    titleColor: '#F9FAFB',
    hoverColor: '#1eda63',
    accentColor: '#22C55E',
    alertBg: '#161A22',
    alertTitle: '#FCA5A5',
    alertText: '#D1D5DB',
    alertIcon: '#F87171',
    modalBg: '#161A22',
    iconColor: '#128b3b',
    borderIcon: '#00a33f',
    buttonCancel: '#FFFFFF',
    buttonApply: '#22C55E',
    inputBg: '#0D1117',
    inputBorder: '#1a2e1f',
  },
  darkYellow: {
    bgColor: '#111315',
    textColor: '#E5E7EB',
    navbarColor: '#B8860B',
    cardBg: '#1A1D21',
    cardSecondaryBg: '#22262B',
    cardColorInput: '#D1D5DB',
    borderColor: '#3A320F',
    textSecondary: '#9CA3AF',
    titleColor: '#FFF4C2',
    hoverColor: '#FACC15',
    accentColor: '#FDE047',
    alertBg: '#1A1D21',
    alertTitle: '#FCA5A5',
    alertText: '#D1D5DB',
    alertIcon: '#F87171',
    modalBg: '#1A1D21',
    iconColor: '#FACC15',
    borderIcon: '#EAB308',
    buttonCancel: '#FFFFFF',
    buttonApply: '#FACC15',
    inputBg: '#0D1009',
    inputBorder: '#3A320F',
  },
  darkRed: {
    bgColor: '#101214',
    textColor: '#E5E7EB',
    navbarColor: '#5B1215',
    cardBg: '#181B20',
    cardSecondaryBg: '#20242A',
    cardColorInput: '#C7C9CC',
    borderColor: '#2B3138',
    textSecondary: '#9CA3AF',
    titleColor: '#FFE4E6',
    hoverColor: '#EF4444',
    accentColor: '#DC2626',
    alertBg: '#181B20',
    alertTitle: '#FCA5A5',
    alertText: '#D1D5DB',
    alertIcon: '#F87171',
    modalBg: '#181B20',
    iconColor: '#DC2626',
    borderIcon: '#EF4444',
    buttonCancel: '#FFFFFF',
    buttonApply: '#DC2626',
    inputBg: '#0D0F12',
    inputBorder: '#2B1F1F',
  },
};

export const defaultTheme = 'lightBlue';
```

Explicación:

- Cada tema es un objeto con colores.
- Estos valores se usan en componentes para mantener una apariencia uniforme.
- `defaultTheme` indica qué tema se usa al inicio.

### `src/core/i18n/i18n.js`

Configura las traducciones de la aplicación.

```js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import es from './es.json';
import en from './en.json';
import fr from './fr.json';
import pt from './pt.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      fr: { translation: fr },
      pt: { translation: pt },
    },
    lng: 'es',
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

Explicación:

- `resources`: coloca cada idioma dentro de `translation`.
- `lng: 'es'`: idioma inicial.
- `fallbackLng: 'es'`: si una clave no existe, usa español.
- `escapeValue: false`: evita escapar texto para que emojis y HTML funcionen correctamente.

### Archivos de traducción `src/core/i18n/*.json`

Cada archivo JSON contiene las mismas claves con diferentes valores.

#### `es.json`

```json
{
  "login": "Iniciar Sesión",
  "email": "Correo electrónico",
  "password": "Contraseña",
  "forgotPassword": "¿Olvidaste tu contraseña?",
  "enter": "Ingresar",
  "sendCode": "Enviar código",
  "verifyCode": "Verificar código",
  "newPassword": "Nueva contraseña",
  "confirmPassword": "Confirmar contraseña",
  "save": "Guardar",
  "route": "Rutas",
  "location": "Ubicación",
  "profile": "Perfil",
  "searchRoute": "Buscar ruta",
  "finalDestination": "Destino final",
  "school": "Escuela"
}
```

#### `en.json`

```json
{
  "login": "Login",
  "email": "Email",
  "password": "Password",
  "forgotPassword": "Forgot your password?",
  "enter": "Enter",
  "sendCode": "Send code",
  "verifyCode": "Verify code",
  "newPassword": "New password",
  "confirmPassword": "Confirm password",
  "save": "Save",
  "route": "Routes",
  "location": "Location",
  "profile": "Profile",
  "searchRoute": "Search route",
  "finalDestination": "Final destination",
  "school": "School"
}
```

#### `fr.json`

```json
{
  "login": "Connexion",
  "email": "E-mail",
  "password": "Mot de passe",
  "forgotPassword": "Mot de passe oublié?",
  "enter": "Entrer",
  "sendCode": "Envoyer le code",
  "verifyCode": "Vérifier le code",
  "newPassword": "Nouveau mot de passe",
  "confirmPassword": "Confirmer le mot de passe",
  "save": "Sauvegarder",
  "route": "Itinéraires",
  "location": "Localisation",
  "profile": "Profil",
  "searchRoute": "Rechercher un itinéraire",
  "finalDestination": "Destination finale",
  "school": "École"
}
```

#### `pt.json`

```json
{
  "login": "Entrar",
  "email": "E-mail",
  "password": "Senha",
  "forgotPassword": "Esqueceu a senha?",
  "enter": "Entrar",
  "sendCode": "Enviar código",
  "verifyCode": "Verificar código",
  "newPassword": "Nova senha",
  "confirmPassword": "Confirmar senha",
  "save": "Salvar",
  "route": "Rotas",
  "location": "Localização",
  "profile": "Perfil",
  "searchRoute": "Pesquisar rota",
  "finalDestination": "Destino final",
  "school": "Escola"
}
```

Explicación:

- Todos los archivos usan las mismas claves.
- Cambiando el idioma en la configuración, `t('clave')` devuelve el texto correcto.
- En el código actual, el idioma por defecto es español.

---

## 4. Componentes disponibles en `src/components`

### `HeaderBar.jsx`

```jsx
import React from "react";
import { View } from "react-native";

export default function HeaderBar() {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: "black",
        width: "100%",
      }}
    />
  );
}
```

Explicación:

- Importa `View`, el contenedor básico.
- Devuelve un `View` con altura de 1 y ancho completo.
- Es un separador visual simple.

### `BottomTabBar.jsx`

```jsx
import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";

export default function BottomTabBar({
  onRoutePress,
  onLocationPress,
  onProfilePress,
}) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View
      style=[
        styles.container,
        {
          backgroundColor: theme.navbarColor,
        },
      ]
    >
      <Pressable style={styles.tab} onPress={onRoutePress}>
        <Text style={styles.icon}>🚌</Text>
        <Text style={styles.label}>{t("route")}</Text>
      </Pressable>

      <Pressable style={styles.tab} onPress={onLocationPress}>
        <Text style={styles.icon}>📍</Text>
        <Text style={styles.label}>{t("location")}</Text>
      </Pressable>

      <Pressable style={styles.tab} onPress={onProfilePress}>
        <Text style={styles.icon}>🧍</Text>
        <Text style={styles.label}>{t("profile")}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 72,
    flexDirection: "row",
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 28,
    color: "#FFFFFF",
  },
  label: {
    fontSize: 10,
    color: "#FFFFFF",
    marginTop: 4,
  },
});
```

Explicación:

- Usa `useTranslation()` para obtener `t`.
- Usa `useTheme()` para obtener colores del tema actual.
- Tres botones (`Pressable`) que ejecutan funciones al presionarlos.
- Los textos de las pestañas se obtienen con traducción.
- Estilos en `StyleSheet.create`, el patrón estándar de React Native.

### `RouteInfoCard.jsx`

```jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";

export default function RouteInfoCard() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View
      style=[
        styles.card,
        {
          backgroundColor: theme.cardBg,
          borderColor: theme.borderColor,
        },
      ]
    >
      <View style={styles.header}>
        <View>
          <Text style=[styles.title, { color: theme.textColor }]>
            Ruta Centro
          </Text>
          <Text style=[styles.subtitle, { color: theme.textSecondary }]>
            Carlos Pérez
          </Text>
        </View>

        <View>
          <Text style=[styles.titleRight, { color: theme.textColor }]>
            ABC-123
          </Text>
          <Text style=[styles.subtitleRight, { color: theme.textSecondary }]>
            06:00 AM - 07:30 AM
          </Text>
        </View>
      </View>

      <View style=[styles.divider, { backgroundColor: theme.borderColor }]} />

      <View style={styles.footer}>
        <View style={styles.column}>
          <Text style=[styles.label, { color: theme.titleColor }]>
            {t("stops")}
          </Text>
          <Text style=[styles.value, { color: theme.textSecondary }]>
            12
          </Text>
        </View>

        <View style={styles.column}>
          <Text style=[styles.label, { color: theme.titleColor }]>
            {t("finalDestination")}
          </Text>
          <Text style=[styles.value, { color: theme.textSecondary }]>
            {t("school")}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
  },
  titleRight: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
  subtitleRight: {
    fontSize: 12,
    textAlign: "right",
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
  },
  value: {
    fontSize: 12,
    marginTop: 4,
  },
});
```

Explicación:

- Tarjeta con dos secciones principales: header y footer.
- `theme` controla colores de fondo y texto.
- `t('stops')` y `t('finalDestination')` traducen las etiquetas.

### `PrimaryButton.jsx`

```jsx
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '@core/services/ThemeService';

export default function PrimaryButton({ text, onPress }) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.buttonApply }]}
      onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
```

Explicación:

- Botón grande con color del tema.
- `TouchableOpacity` ofrece efecto táctil.
- `text` se muestra centrado.

### `NotificationButton.jsx`

```jsx
import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { useTheme } from "@core/services/ThemeService";

export default function NotificationButton({ onPress }) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: theme.cardBg,
          borderColor: theme.borderColor,
        },
      ]}
    >
      <Text style={[styles.icon, { color: theme.textColor }]}>🔔</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 24,
  },
});
```

Explicación:

- Botón cuadrado con icono de campana.
- Usa el tema para color de borde y fondo.
- `Pressable` permite detectar toques.

### `InputField.jsx`

```jsx
import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useTheme } from "@core/services/ThemeService";

export default function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  secureTextEntry = false,
}) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.cardColorInput}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        style={[
          styles.input,
          {
            backgroundColor: theme.cardSecondaryBg,
            borderColor: theme.borderColor,
            color: theme.textColor,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    marginBottom: 4,
  },
  input: {
    height: 50,
    width: 330,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});
```

Explicación:

- `label`: texto encima del campo.
- `TextInput`: campo editable.
- `keyboardType`: tipo de teclado (número, texto, email).
- `secureTextEntry`: oculta caracteres para contraseñas.

### `SearchInput.jsx`

```jsx
import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@core/services/ThemeService";

export default function SearchInput({
  value,
  onChangeText,
}) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.cardBg,
          borderColor: theme.borderColor,
        },
      ]}
    >
      <Text style={[styles.icon, { color: theme.textSecondary }]}>🔎</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={t("searchRoute")}
        placeholderTextColor={theme.cardColorInput}
        style={[styles.input, { color: theme.textColor }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});
```

Explicación:

- Campo de búsqueda estilo tarjeta.
- Icono de lupa y placeholder traducido.
- Usado para buscar rutas.

### `CodeInput.jsx`

```jsx
import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { useTheme } from "@core/services/ThemeService";

export default function CodeInput() {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {[...Array(6)].map((_, index) => (
        <TextInput
          key={index}
          maxLength={1}
          keyboardType="numeric"
          style={[
            styles.input,
            {
              backgroundColor: theme.cardSecondaryBg,
              borderColor: theme.borderColor,
              color: theme.textColor,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  input: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
  },
});
```

Explicación:

- Crea seis campos de un solo carácter.
- Usado típicamente para códigos de verificación.
- Cada campo acepta solo números.

### `SettingsItem.jsx`

```jsx
import React from "react";
import { Pressable, View, Text, Image, StyleSheet } from "react-native";
import { useTheme } from "@core/services/ThemeService";

export default function SettingsItem({
  icon,
  title,
  onPress,
}) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: theme.cardSecondaryBg,
          borderColor: theme.borderColor,
        },
      ]}
    >
      <Image source={icon} style={styles.icon} />
      <Text style={[styles.title, { color: theme.textColor }]}>
        {title}
      </Text>
      <Text style={[styles.arrow, { color: theme.textSecondary }]}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 26,
    height: 26,
    resizeMode: "contain",
  },
  title: {
    flex: 1,
    marginLeft: 15,
    fontSize: 17,
  },
  arrow: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
```

Explicación:

- `Pressable` convierte el componente en un botón.
- `Image` muestra el icono.
- `Text` muestra el título y la flecha.
- `flexDirection: 'row'` organiza el contenido en una fila.

---

## 5. Funcionamiento de los estilos y traducciones

### Estilos

- En React Native no hay CSS global.
- Cada componente define sus propios estilos con `StyleSheet.create()`.
- `theme` agrega colores dinámicos desde `ThemeService`.
- Los componentes mezclan estilos estáticos con valores de tema.

Ejemplo:

```js
style={[styles.input, { backgroundColor: theme.cardSecondaryBg, borderColor: theme.borderColor }]}
```

Esto significa:

- `styles.input`: estilos fijos.
- `{ backgroundColor: theme.cardSecondaryBg, borderColor: theme.borderColor }`: colores que cambian según el tema.

### Traducciones

- `useTranslation()` devuelve la función `t()`.
- `t('route')` busca en el idioma activo la clave `route`.
- Los archivos JSON almacenan los textos por idioma.
- Si `lng: 'es'`, se muestra español.
- Si alguna clave no existe, `fallbackLng: 'es'` usa español.

Ejemplo de uso:

```jsx
<Text>{t('searchRoute')}</Text>
```

---

## 6. Archivos referenciados pero no disponibles

`App.js` importa estas pantallas, pero no están en este workspace:

- `src/features/auth/views/Welcome`
- `src/features/auth/views/ForgotPassword`
- `src/features/auth/views/VerifyCode`
- `src/features/auth/views/NewPassword`
- `src/features/home/views/MainPage`
- `src/features/profile/views/Profile`

Si se agregan, esas pantallas completarían el flujo de login y navegación.

---

## 7. Resumen final

- `App.js` une el tema y la navegación.
- `ThemeService` y `Colors.js` definen el diseño visual global.
- `i18n` y los JSON traducen los textos.
- `src/components` contiene los bloques reutilizables de UI.
- Los estilos son locales a cada componente y los colores se inyectan por tema.

Este informe incluye el código real de los archivos disponibles y explica qué hace cada parte de forma clara y detallada.

### `src/components/buttons/PrimaryButton.jsx`

Botón principal reutilizable.

- Importa `TouchableOpacity`, `Text`, `StyleSheet`.
- Usa `useTheme` para el color del botón.
- Propiedades:
  - `text`: texto del botón.
  - `onPress`: acción al tocar.
- Renderiza un botón con fondo `theme.buttonApply`.
- El texto es blanco, en negrita y de tamaño 16.

### `src/components/buttons/NotificationButton.jsx`

Botón con icono de campana.

- Importa `Pressable`, `Text`, `StyleSheet`.
- `useTheme()` para tema actual.
- `onPress`: función cuando se toca.
- Estilos:
  - tamaño 50x50.
  - borde redondeado.
  - fondo `theme.cardBg` y borde `theme.borderColor`.
- Usado para mostrar notificaciones.

### `src/components/inputs/InputField.jsx`

Campo de entrada con etiqueta.

Propiedades:
- `label`: texto de la etiqueta.
- `placeholder`: texto de sugerencia.
- `value`: valor actual.
- `onChangeText`: función de cambio.
- `keyboardType`: tipo de teclado (`default` por defecto).
- `secureTextEntry`: si el texto es seguro (contraseña).

Contenido:
- `Text` para la etiqueta, color secundario.
- `TextInput` con placeholder traducido, borde y fondo del tema.
- `style`: altura 50, ancho 330, radio 10.

### `src/components/inputs/SearchInput.jsx`

Campo de búsqueda con icono de lupa.

- Importa `View`, `TextInput`, `Text`, `StyleSheet`.
- Usa `useTranslation` y `useTheme`.
- `placeholder={t('searchRoute')}` muestra texto traducido.
- Contenedor con borde y fondo de tarjeta.
- Icono de lupa y campo de texto.

### `src/components/inputs/CodeInput.jsx`

Entrada de 6 dígitos para códigos.

- Usa `useTheme`.
- Crea 6 campos `TextInput` con `Array(6).map(... )`.
- Cada campo tiene `maxLength={1}` y `keyboardType='numeric'`.
- Estilo: ancho 45, alto 50, borde redondeado y texto centrado.

### `src/components/inputs/SettingsItem.jsx`

Item de lista para la pantalla de configuración.

Propiedades:
- `icon`: imagen del icono.
- `title`: texto del elemento.
- `onPress`: acción al tocar.

Contenido:
- `Pressable` con fondo y borde del tema.
- `Image` para el icono.
- `Text` para el título.
- `Text` para la flecha derecha.

Estilos:
- altura 60, bordes redondeados, paddings.
- fila horizontal con icono, texto y flecha.

---

## 5. Cómo funciona el tema global y los estilos

No hay un archivo de estilos CSS global como en web. En React Native los estilos van por componente usando `StyleSheet.create(...)`.

Sin embargo, hay un tema global de colores en `ThemeService` y `Colors.js`.

- `ThemeProvider` provee el color actual a todos los componentes.
- Cada componente llama a `useTheme()` para obtener `theme`.
- Luego usa `theme.<propiedad>` en estilos dinámicos.

Ejemplo:
- `backgroundColor: theme.cardBg`
- `borderColor: theme.borderColor`
- `color: theme.textColor`

Esto permite cambiar colores desde un solo lugar.

---

## 6. Cómo funcionan las traducciones

El sistema de traducción usa `react-i18next`.

- `src/core/i18n/i18n.js` registra los recursos de idioma.
- Cada archivo JSON contiene pares `clave: valor`.
- `useTranslation()` devuelve la función `t`.
- `t('route')` devuelve el texto correcto según el idioma activo.

Ejemplo de uso:

- `t('route')` puede mostrar "Rutas" en español, "Routes" en inglés.
- `t('location')` puede mostrar "Ubicación" o "Location".
- `t('searchRoute')` es el texto plaza del placeholder.

Como `lng: 'es'`, el idioma por defecto es español.

---

## 7. Archivos referenciados pero no presentes

`App.js` importa las siguientes pantallas:

- `src/features/auth/views/Welcome`
- `src/features/auth/views/ForgotPassword`
- `src/features/auth/views/VerifyCode`
- `src/features/auth/views/NewPassword`
- `src/features/home/views/MainPage`
- `src/features/profile/views/Profile`

Estos archivos no existen en el workspace actual, por lo que no se pueden documentar línea por línea.

---

## 8. Resumen sencillo para personas que no saben

- `index.js` arranca la app.
- `App.js` es el corazón: define navegación y tema.
- `src/core/`: guarda colores y traducciones.
- `src/components/`: son piezas pequeñas que forman la pantalla.
- Los componentes usan colores del `theme` y texto traducido con `t()`.
- No hay hojas de estilo globales: cada componente define sus propios estilos.
- Las traducciones están en JSON, y `i18n.js` las carga.

> Si quieres entender la app, imagina que cada archivo es una pieza de Lego. `App.js` une las piezas, `ThemeService` define el color del Lego, y `i18n` define el idioma de las etiquetas.
