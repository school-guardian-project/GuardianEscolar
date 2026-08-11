# Documentación del proyecto Guardian Escolar

> Última revición: 9 de agosto de 2026.

## 0. Introducción

Guardian Escolar es una aplicación móvil construida con React Native y Expo. Está diseñada para familias o acudientes y permite:

- iniciar sesión,
- recuperar el acceso,
- consultar una ruta escolar en un mapa,
- administrar información de perfil,
- ajustar apariencia e idioma.

Esta documentación describe no solo qué hace la app, sino también cómo lo hace. Incluye teoría general, explicación técnica de cada bloque de código importante y referencias directas a los archivos existentes.

## 1. Teoría básica

### 1.1 ¿Qué es React Native?

React Native es un framework para construir aplicaciones móviles usando JavaScript y React. En lugar de generar HTML en un navegador, React Native traduce los componentes en widgets nativos de Android, iOS y web.

- `View` es equivalente a un contenedor `div`.
- `Text` sirve para mostrar texto en pantalla.
- `TextInput` es el campo de entrada.
- `StyleSheet.create()` organiza estilos similares a CSS, pero en formato JavaScript.

### 1.2 ¿Qué es Expo?

Expo es una plataforma que simplifica el desarrollo con React Native. Proporciona:

- bundler integrado,
- acceso a APIs nativas (`expo-location`, cámara, notificaciones),
- herramientas de construcción y depuración.

En este proyecto, Expo usa `registerRootComponent(App)` en `index.js` para arrancar la aplicación correctamente.

### 1.3 ¿Qué es React Navigation?

React Navigation es la librería de navegación usada para mover entre pantallas. Ofrece varios tipos de navegadores:

- `Stack.Navigator`: navegación en pila.
- `Tab.Navigator`: navegación por pestañas.

En este proyecto se combinan ambos: el stack principal es la columna vertebral, y `HomeTabs` define pestañas internas.

### 1.4 ¿Qué es Context y Provider?

Context es un mecanismo para compartir datos entre componentes sin pasar props manualmente en cada nivel.

- `ThemeProvider` crea un contexto de tema global.
- `useTheme()` consume ese contexto en cualquier componente.

Esto permite que el color del tema, el modo claro/oscuro y la lógica de persistencia estén disponibles en toda la app.

### 1.5 ¿Qué es internacionalización (i18n)?

La internacionalización separa texto del código. En lugar de escribir `"Perfil"` en el componente, se usa `t("profile.title")`.

- `i18next` gestiona los recursos de idioma.
- `react-i18next` integra `i18next` con React.
- El idioma se puede guardar y cargar desde `AsyncStorage`.

## 2. Arquitectura del proyecto

```text
guardian-escolar/
├── App.js                         # Navegación raíz, proveedor de tema y carga de idioma
├── index.js                       # Registro del componente raíz en Expo
├── app.json                       # Configuración de Expo
├── assets/                        # Recursos visuales y multimedia
└── src/
    ├── components/                 # Componentes visuales reutilizables
    │   ├── account/                # Layouts y pantallas de cuenta genéricos
    │   ├── buttons/                # Botones reutilizables
    │   ├── cards/                  # Tarjetas y filas de información
    │   ├── inputs/                 # Inputs reutilizables y código de verificación
    │   └── layout/                 # Contenedores de navegación y diseño
    ├── core/                       # Servicios, constantes, hooks y estilos globales
    │   ├── constants/              # Temas de colores
    │   ├── hooks/                  # Hooks reutilizables
    │   ├── i18n/                   # Internacionalización
    │   ├── services/               # Contextos y proveedores globales
    │   └── styles/                 # Estilos compartidos
    └── features/                   # Vistas agrupadas por funcionalidad
        ├── account/                # Gestión de correo, teléfono y contraseña
        ├── auth/                   # Login y flujo de ingreso
        ├── home/                   # Página principal con mapa y ruta escolar
        └── profile/                # Perfil del usuario y ajustes
```

### 2.1 Alias de importación

Los alias de ruta reducen la complejidad de las importaciones. Están definidos en:

- `babel.config.js`
- `tsconfig.json`

Alias usados:

- `@components/*` → `src/components/*`
- `@features/*` → `src/features/*`
- `@core/*` → `src/core/*`
- `@assets/*` → `assets/*`

Esto permite escribir `import SearchInput from '@components/inputs/SearchInput'` en lugar de rutas relativas largas.

## 3. Ejecución del proyecto

Comandos principales:

```bash
npm install
npm start
npm run android
npm run ios
npm run web
```

- `npm install`: instala dependencias.
- `npm start`: inicia Expo.
- `npm run android/ios/web`: abre la app en el destino correspondiente.

## 4. Explicaciones de código clave

### 4.1 `index.js`

```js
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
```

Explicación línea a línea:

- `import { registerRootComponent } from 'expo';`
  - importa la función que Expo usa para arrancar la app.
- `import App from './App';`
  - importa el componente raíz de la aplicación.
- `registerRootComponent(App);`
  - registra `App` como el componente inicial.
  - Expo envuelve este componente con su propio `AppRegistry`.

### 4.2 `App.js`

Explicación general:

`App.js` es el punto de entrada de la navegación. Combina el proveedor de tema, la carga del idioma y la configuración del stack principal.

```js
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeProvider } from '@core/services/ThemeService';
import { loadLanguage } from '@core/i18n/i18n';
```

- `useEffect`, `useState`: hooks de React para manejar estado y efectos secundarios.
- `NavigationContainer`: componente raíz de la navegación.
- `createStackNavigator` y `createBottomTabNavigator`: crean los navegadores de pila y pestañas.
- `ThemeProvider`: proporciona el tema a toda la app.
- `loadLanguage`: carga el idioma guardado.

```js
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
```

- Crea instancias de los navegadores.

```js
function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name='MainPage' component={MainPage} />
      <Tab.Screen name='Profile' component={Profile} />
    </Tab.Navigator>
  );
}
```

- `HomeTabs` define dos pestañas.
- `screenOptions={{ headerShown: false }}` oculta el encabezado nativo de las pestañas.

```js
export default function App() {
  const [languageLoaded, setLanguageLoaded] = useState(false);

  useEffect(() => {
    const initializeLanguage = async () => {
      await loadLanguage();
      setLanguageLoaded(true);
    };

    initializeLanguage();
  }, []);
```

- `languageLoaded` indica si el idioma ya está cargado.
- `useEffect` corre una vez al montar el componente.
- `initializeLanguage` llama a `loadLanguage()` y luego activa `languageLoaded`.

```js
if (!languageLoaded) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Cargando...</Text>
    </View>
  );
}
```

- Mientras el idioma se carga, muestra una pantalla de carga.
- Esto evita que la aplicación renderice componentes con textos en blanco o configuraciones no listas.

```js
return (
  <ThemeProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Login' component={Login} />
        ...
      </Stack.Navigator>
    </NavigationContainer>
  </ThemeProvider>
);
```

- `ThemeProvider` envuelve todo.
- `Stack.Navigator` define la ruta inicial y desactiva el encabezado nativo.
- Todas las pantallas se registran como rutas del stack.

### 4.3 `ThemeService.js`

Este archivo implementa la lógica de selección de tema y persistencia.

```js
import React, { useState, createContext, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes, defaultTheme } from '../constants/Colors';
```

- Importa los hooks de React necesarios.
- `AsyncStorage` guarda el tema localmente.
- `themes` y `defaultTheme` vienen de `Colors.js`.

```js
const THEME_KEY = '@guardian_escolar_theme';
export const ThemeContext = createContext();
export function useTheme() { return useContext(ThemeContext); }
```

- `THEME_KEY` es la clave usada en almacenamiento.
- `ThemeContext` crea el contexto.
- `useTheme()` es un hook personalizado que devuelve el valor del contexto.

```js
export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState(defaultTheme);
  const [themeLoaded, setThemeLoaded] = useState(false);
  const theme = themes[themeName];
  const isDark = themeName.startsWith('dark');
```

- `themeName` guarda el tema actual.
- `themeLoaded` evita renderizar hasta que se cargue el tema de AsyncStorage.
- `theme` obtiene los colores reales.
- `isDark` decide si el tema está en modo oscuro.

```js
useEffect(() => {
  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme && themes[savedTheme]) {
        setThemeName(savedTheme);
      }
    } catch (error) {
      console.log('Error cargando el tema:', error);
    } finally {
      setThemeLoaded(true);
    }
  };
  loadTheme();
}, []);
```

- Carga el tema guardado la primera vez que el proveedor se monta.
- Si hay un tema válido en almacenamiento, lo aplica.
- `finally` asegura que `themeLoaded` sea true aunque ocurra un error.

```js
const changeTheme = async (name) => {
  if (!themes[name]) return;
  setThemeName(name);
  try { await AsyncStorage.setItem(THEME_KEY, name); } catch (error) { console.log('Error guardando el tema:', error); }
};
```

- Cambia el tema a uno válido.
- Guarda la preferencia en `AsyncStorage`.

```js
const changeColor = async (color) => {
  const newTheme = isDark ? `dark${capitalize(color)}` : `light${capitalize(color)}`;
  if (themes[newTheme]) { await changeTheme(newTheme); }
};
```

- Cambia solo el color, conservando claro/oscuro.
- Por ejemplo, si el tema actual es `darkBlue` y `color='green'`, cambia a `darkGreen`.

```js
const toggleTheme = async () => {
  const color = getCurrentColor(themeName);
  const newTheme = isDark ? `light${capitalize(color)}` : `dark${capitalize(color)}`;
  await changeTheme(newTheme);
};
```

- Alterna entre modo claro y oscuro manteniendo el color actual.

```js
if (!themeLoaded) return null;
```

- Durante la carga del tema no renderiza los hijos.
- Previene errores que ocurren cuando componentes leen `theme` antes de que esté listo.

```js
return (
  <ThemeContext.Provider value={{ theme, themeName, isDark, changeTheme, changeColor, toggleTheme }}>
    {children}
  </ThemeContext.Provider>
);
```

- Exposición del contexto.
- `children` son los componentes de la aplicación que consumen este tema.

### 4.4 `src/core/constants/Colors.js`

Este archivo define las paletas de color usadas en la app.

- Cada tema es un objeto con propiedades semánticas.
- `bgColor`: fondo principal.
- `textColor`: texto principal.
- `navbarColor`: color de la barra inferior.
- `cardBg`, `cardSecondaryBg`: fondos de tarjetas.
- `borderColor`: color de bordes.
- `buttonApply`: color de botones primarios.

La aplicación no usa valores de color de forma arbitraria: siempre consume este objeto `theme`.

### 4.5 `src/core/i18n/i18n.js`

```js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import es from './es.json';
import en from './en.json';
import fr from './fr.json';
import pt from './pt.json';
```

- Importa las librerías de i18n.
- Trae los archivos JSON de traducción.

```js
const LANGUAGE_KEY = '@guardian_escolar_language';
const resources = { es: { translation: es }, en: { translation: en }, fr: { translation: fr }, pt: { translation: pt }, };
```

- `LANGUAGE_KEY` define la clave de almacenamiento.
- `resources` agrupa los textos por idioma.

```js
i18n.use(initReactI18next).init({ resources, lng: 'es', fallbackLng: 'es', interpolation: { escapeValue: false }, });
```

- Inicializa i18next con React.
- `lng: 'es'` define el idioma inicial.
- `fallbackLng: 'es'` usa español si el idioma no existe.
- `escapeValue: false` permite HTML seguro en React.

```js
export const loadLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage && resources[savedLanguage]) {
      await i18n.changeLanguage(savedLanguage);
    }
  } catch (error) {
    console.log('Error cargando idioma:', error);
  }
};
```

- Lee el idioma guardado y lo aplica.

```js
export const changeLanguage = async (language) => {
  try {
    await i18n.changeLanguage(language);
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.log('Error guardando idioma:', error);
  }
};
```

- Cambia el idioma actual y persiste la opción.

## 5. Flujo de navegación

### 5.1 `Stack.Navigator`

El stack es la columna vertebral de la navegación. Se usa para flujos secuenciales como:

- Login → ForgotPassword → VerifyCode → NewPassword.
- Profile → Security → UpdatePassword → VerifyCodePassword → ChangePasswordForm.

Cada pantalla se registra con un `name` y un `component`.

### 5.2 `HomeTabs`

`HomeTabs` define una navegación por pestañas entre:

- `MainPage`
- `Profile`

En este proyecto, `HomeTabs` está registrado en el stack, pero el login actual no lo consume. En su lugar navega directamente a `MainPage`.

## 6. Pantallas principales con explicación línea a línea

### 6.1 `src/features/auth/views/Login/Login.jsx`

```js
import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@core/services/ThemeService';
import InputField from '@components/inputs/InputField';
import PrimaryButton from '@components/buttons/PrimaryButton';
import styles from './Login.styles';
```

- Importa hooks y componentes necesarios.
- `useTranslation()` trae la función `t`.
- `useTheme()` trae el tema actual.
- `ScrollView` permite desplazar el contenido en pantallas pequeñas.

```js
export default function Login({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
```

- `navigation` es un prop automático del stack.
- `email` y `password` guardan los datos del formulario.

```js
return (
  <ScrollView style={{ backgroundColor: theme.bgColor }} contentContainerStyle={styles.container} keyboardShouldPersistTaps='handled'>
```

- `style` aplica el fondo según el tema.
- `contentContainerStyle` define el layout interno.
- `keyboardShouldPersistTaps='handled'` evita que el teclado cierre cuando tocas botones.

```js
<Text style={styles.icon}>🛡️</Text>
<Text style={[styles.title, { color: theme.titleColor }]}>{t('login.title')}</Text>
```

- Renderiza el icono y el título.
- `t('login.title')` usa internacionalización.

```js
<InputField label={t('inputs.title.email')} placeholder='ejemplo@gmail.com' value={email} onChangeText={setEmail} keyboardType='email-address' />
```

- `InputField` es un componente reutilizable.
- `onChangeText={setEmail}` actualiza el estado cuando el usuario escribe.

```js
<Text style={[styles.forgotPassword, { color: theme.navbarColor }]} onPress={() => navigation.navigate('ForgotPassword')}>{t('login.ForgotPassword')}</Text>
```

- Este texto funciona como un botón.
- `navigation.navigate('ForgotPassword')` cambia a la pantalla de recuperación.

```js
<PrimaryButton text={t('button.enter')} onPress={() => navigation.navigate('MainPage')} />
```

- El botón principal navega a `MainPage`.
- No hay validación de credenciales.

### 6.2 `src/features/home/views/MainPage/MainPage.jsx`

```js
import React from 'react';
import { View } from 'react-native';
import MapView from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SearchInput from '@components/inputs/SearchInput';
import NotificationButton from '@components/buttons/NotificationButton';
import RouteInfoCard from '@components/cards/RouteInfoCard';
import BottomTabBar from '@components/layout/BottomTabBar';
import useWindow from '@core/hooks/useWindow';
import styles from './MainPage.style';
```

- Importa un mapa y componentes de UI.
- `useSafeAreaInsets()` evita que el contenido quede detrás de la barra superior o cámara.

```js
export default function MainPage() {
  const { width } = useWindow();
  const insets = useSafeAreaInsets();
  const horizontalPadding = width < 360 ? 12 : 16;
```

- `useWindow()` devuelve el ancho de pantalla.
- Ajusta el `horizontalPadding` según el ancho.

```js
return (
  <View style={styles.container}>
    <MapView style={styles.map} initialRegion={{ latitude: 2.9273, longitude: -75.2819, latitudeDelta: 0.08, longitudeDelta: 0.08 }} />
```

- `MapView` muestra el mapa con una región inicial fija.
- `latitudeDelta` y `longitudeDelta` controlan el zoom.

```js
<View pointerEvents='box-none' style={[styles.overlay, { paddingHorizontal: horizontalPadding, paddingTop: Math.max(insets.top, 12), paddingBottom: 0 }]}>
```

- `pointerEvents='box-none'` permite que el mapa reciba toques fuera del contenedor superpuesto.
- Ajusta el padding con la zona segura.

```js
<View style={styles.topBar}> <View style={styles.searchWrapper}><SearchInput /></View> <NotificationButton /></View>
```

- Muestra el campo de búsqueda y el botón de notificación.

```js
<BottomTabBar onRoutePress={() => navigation.navigate('MainPage')} onLocationPress={() => navigation.navigate('Location')} onProfilePress={() => navigation.navigate('Profile')} />
```

- Este bloque intenta pasar callbacks de navegación.
- En la implementación actual de `MainPage` no existe `navigation`, por lo que esta parte está incompleta.
- `BottomTabBar` sin embargo navega internamente a `MainPage` y `Profile`.

### 6.3 `src/features/profile/views/Profile/Profile.jsx`

```js
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
import { useTheme } from '@core/services/ThemeService';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import SettingsItem from '@components/inputs/SettingsItem';
import BottomTabBar from '@components/layout/BottomTabBar';
import styles from './Profile.style';
```

- Importa iconos y hooks.
- Usa `useNavigation()` para navegar entre pantallas.

```js
export default function Profile() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
```

- `theme` aplica colores.
- `t` genera textos traducidos.
- `navigation` permite cambios de pantalla.

```js
<View style={[styles.container, { backgroundColor: theme.bgColor }]}> ... </View>
```

- Fondo de la pantalla según el tema.

```js
<SettingsItem icon={<Ionicons name='person' ... />} title={t('inputs.data')} onPress={() => navigation.navigate('Datas')} />
```

- Cada opción de perfil es una fila clicable.
- Usa iconos y textos traducidos.

```js
<BottomTabBar />
```

- Muestra la barra inferior.
- Aunque esta pantalla ya está disponible en el tab navigator, el componente sigue renderizando su propio tab bar.

### 6.4 `src/features/profile/views/Appearance/Appearance.jsx`

Explicación general:

`Appearance` permite cambiar el modo claro/oscuro y el color principal usando el contexto de tema.

```js
const { theme, themeName, isDark, toggleTheme, changeColor } = useTheme();
```

- `theme`: objeto de colores actual.
- `themeName`: nombre del tema (`darkBlue`, `lightGreen`, etc.).
- `isDark`: booleano que indica si está en modo oscuro.
- `toggleTheme`: alterna claro/oscuro.
- `changeColor`: cambia el color manteniendo el modo.

```js
<BackButton label={t('inputs.appearance')} backTo='Profile' />
```

- Usa `BackButton` para regresar a `Profile`.

```js
<Pressable onPress={() => { if (isDark) { toggleTheme(); } }} ...>
```

- En la tarjeta de modo claro, sólo cambia el tema si actualmente está en oscuro.

```js
<Pressable onPress={() => { if (!isDark) { toggleTheme(); } }} ...>
```

- En la tarjeta de modo oscuro, sólo cambia si actualmente está en claro.

```js
<ColorOption name='Azul' ... onPress={() => changeColor('blue')} />
```

- Cambia el color actual conservando claro/oscuro.
- `ColorOption` renderiza el nombre, una vista de color y un check si está seleccionado.

### 6.5 Componentes de cuenta genéricos

#### `FormScreen.jsx`

- Recibe `title`, `description`, `label`, `placeholder`, `buttonText` y `nextScreen`.
- Usa `AccountLayout` para dar estructura común a todas las pantallas de cuenta.
- `InputField` renderiza un campo.
- `PrimaryButton` navega a `nextScreen`.

Este componente reduce repetición en flujos como:

- `ForgotPassword`
- `NewEmail`
- `NewPhone`

#### `VerifyScreen.jsx`

- Renderiza `AccountLayout` con `CodeInput` y un botón.
- `handleSubmit` permite un `onSuccess` opcional.
- Si no hay callback, navega a `nextScreen`.
- También muestra un texto para reenvío de código.

#### `PasswordScreen.jsx`

- Renderiza dos `InputField` para la contraseña nueva y su confirmación.
- Navega a `nextScreen` o ejecuta `onSuccess`.

Este patrón se usa en los flujos de cambio de contraseña.

## 7. Componentes reutilizables y su código

### 7.1 `PrimaryButton.jsx`

```js
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '@core/services/ThemeService';

export default function PrimaryButton({ text, onPress }) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: theme.buttonApply }]} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}
```

- `TouchableOpacity` es un botón táctil con retroalimentación de opacidad.
- `style={[styles.button, { backgroundColor: theme.buttonApply }]}` mezcla estilos estáticos con el color del tema.
- `text` se muestra en blanco y bold.

### 7.2 `BackButton.jsx`

```js
import React from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@core/services/ThemeService';
```

- Importa el icono de flecha y la navegación.

```js
const handleBack = () => {
  if (backTo) { navigation.navigate(backTo); return; }
  if (navigation.canGoBack()) { navigation.goBack(); } else { navigation.navigate('Login'); }
};
```

- Si se recibe `backTo`, navega directamente.
- Si puede regresar en la pila, usa `goBack()`.
- Si no, envía al usuario a `Login`.

### 7.3 `AccountLayout.jsx`

- `AccountLayout` es una plantilla visual común para las pantallas de cuenta.

```js
return (
  <View style={[styles.container, { backgroundColor: theme.bgColor }]}> ... </View>
);
```

- Aplica el tema al fondo.
- Inserta el encabezado y los contenidos enviados como `children`.

### 7.4 `InputField.jsx`

```js
export default function InputField({ label, placeholder, value = '', onChangeText = () => {}, keyboardType = 'default', secureTextEntry = false }) {
  const { theme } = useTheme();
```

- Usa valores por defecto para evitar errores cuando no se pasan props.
- `onChangeText` es un callback que actualiza el estado del padre.

```js
<Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
<TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={theme.cardColorInput} keyboardType={keyboardType} secureTextEntry={secureTextEntry} style={[styles.input, { backgroundColor: theme.cardSecondaryBg, borderColor: theme.borderColor, color: theme.textColor }]} />
```

- Separa la etiqueta del input.
- Aplica color de placeholder y colores de tema.

### 7.5 `NotificationButton.jsx`

```js
<Pressable onPress={onPress} style={[styles.button, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}>
  <Text style={[styles.icon, { color: theme.textColor }]}> <Ionicons name='notifications' size={24} color='black' /> </Text>
</Pressable>
```

- Botón con borde y icono.
- El color del icono interno es negro, pero el contenedor usa colores de tema.

### 7.6 `InfoRow.jsx`

```js
export default function InfoRow({ icon, title, value, subtitle, editable = false, onPress, last = false, rightComponent, editOnPress }) {
  const { theme } = useTheme();
```

- Componente flexible para mostrar datos en filas.

```js
<Pressable onPress={onPress}> ... </Pressable>
```

- Si `last` es falso agrega una línea divisoria.
- El icono izquierdo es fijo.

```js
{rightComponent ? rightComponent : editable ? (<Pressable onPress={editOnPress} hitSlop={10}><Ionicons name='create-outline' size={25} color={theme.iconColor} /></Pressable>) : null}
```

- Si se pasa `rightComponent`, lo usa.
- Si `editable` es cierto, muestra un icono de edición.

### 7.7 `ExpandedSection.jsx`

```js
const [expanded, setExpanded] = useState(false);
```

- `expanded` guarda el estado de desplegado.

```js
<Pressable style={styles.header} onPress={() => setExpanded(!expanded)}> ... </Pressable>

{expanded && (
  <View style={[styles.body, { borderTopColor: theme.borderColor }]}> ... </View>
)}
```

- Al presionar cambia el estado.
- Si `expanded` es verdadero, muestra el cuerpo con el contenido.

## 8. Componentes de navegación

### 8.1 `BottomTabBar.jsx`

```js
const { t } = useTranslation();
const { theme } = useTheme();
const navigation = useNavigation();
```

- Usa traducciones, tema y navegación.

```js
<Pressable style={styles.tab} onPress={() => navigation.navigate('MainPage')}>...</Pressable>
<Pressable style={styles.tab} onPress={onLocationPress}>...</Pressable>
<Pressable style={styles.tab} onPress={() => navigation.navigate('Profile')}>...</Pressable>
```

- El botón de ubicación llama a `onLocationPress`, pero las otras pestañas navegan internamente.
- Esto hace que las props `onRoutePress` y `onProfilePress` sean redundantes.

## 9. Estado actual del proyecto

### 9.1 Implementado

- UI de login.
- Flujo de recuperación de contraseña.
- Página de mapa con `react-native-maps`.
- Menú de perfil con subpantallas.
- Tema persistente con selección de color.
- Internacionalización en cuatro idiomas.
- Componentes reutilizables para formularios y pantallas de cuenta.

### 9.2 Parcial / pendiente

- No hay autenticación real ni consumo de API.
- `MainPage` no usa `navigation` correctamente.
- `expo-location` no está implementado.
- `Support` y `Rating` no envían datos reales.
- `HomeTabs` no se usa después del login.

### 9.3 Recomendaciones técnicas

- Establecer un único patrón de navegación para `BottomTabBar`.
- Conectar la UI a un backend real para login y cambios de datos.
- Añadir validación de formularios antes de navegar.
- Corregir la llamada a `navigation` en `MainPage`.
- Usar `expo-location` o eliminar la dependencia.

## 10. Archivos importantes y su función

| Archivo | Función |
| --- | --- |
| `App.js` | Contenedor de navegación y tema global. |
| `index.js` | Registro de la app en Expo. |
| `package.json` | Dependencias y scripts. |
| `babel.config.js` | Alias de importación. |
| `tsconfig.json` | Configuración de TypeScript. |
| `src/core/constants/Colors.js` | Paletas de tema. |
| `src/core/services/ThemeService.js` | Lógica de temas y persistencia. |
| `src/core/i18n/i18n.js` | Configuración de idiomas. |

| Archivo | Función |
| --- | --- |
| `src/features/auth/views/Login/Login.jsx` | Pantalla de inicio de sesión. |
| `src/features/account/views/Password/ForgotPassword/ForgotPassword/ForgotPassword.jsx` | Flujo de recuperación de contraseña. |
| `src/features/account/views/Password/ForgotPassword/VerifyCode/VerifyCode.jsx` | Verificación de código. |
| `src/features/account/views/Password/ForgotPassword/NewPassword/NewPassword.jsx` | Cambio de contraseña. |
| `src/features/home/views/MainPage/MainPage.jsx` | Pantalla de mapa y ruta escolar. |
| `src/features/profile/views/Profile/Profile.jsx` | Pantalla de perfil. |
| `src/features/profile/views/Appearance/Appearance.jsx` | Ajustes de apariencia. |

### Componentes reutilizables
- `src/components/account/screens/FormScreen.jsx`
- `src/components/account/screens/VerifyScreen.jsx`
- `src/components/account/screens/PasswordScreen.jsx`
- `src/components/inputs/InputField.jsx`
- `src/components/inputs/CodeInput.jsx`
- `src/components/inputs/SearchInput.jsx`
- `src/components/inputs/SettingsItem.jsx`
- `src/components/layout/BottomTabBar.jsx`
- `src/components/cards/RouteInfoCard.jsx`

## 11. Conclusión

Esta documentación ya no es solo una descripción general: incluye teoría sobre React Native, Expo, navegación, contexto y traducción, así como explicaciones del código existente línea por línea y por bloque. Usa esta base para entender cómo funciona la app actualmente y dónde es más urgente intervenir.

---

> Nota: Si necesitas, puedo crear una segunda página de documentación con ejemplos de refactorización y soluciones para los bugs detectados.

## 10. Resumen

Guardian Escolar cuenta ahora con una base de interfaz completa para autenticación, consulta de ruta y gestión de perfil. La arquitectura separa pantallas, componentes compartidos y servicios globales; el tema y las traducciones se aplican de forma transversal. El siguiente paso natural es reemplazar los datos simulados y las acciones de navegación incompletas por flujos conectados a los servicios reales del proyecto.
