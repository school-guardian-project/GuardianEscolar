# Funcionamiento actual del proyecto MAUI

Este documento resume el estado actual de la aplicacion movil MAUI ubicada en:

```text
dvlp-movil/app-movil/app-movil
```

La aplicacion compila correctamente despues de ajustar las rutas de la solucion y los namespaces de algunos componentes reorganizados.

Validacion realizada:

```powershell
dotnet build app-movil.slnx
```

Resultado:

```text
0 Errores
64 Advertencias
```

Las advertencias actuales no bloquean la compilacion. Estan relacionadas principalmente con nulabilidad y analisis de plataforma.

## 1. Estructura general

La solucion principal esta en:

```text
dvlp-movil/app-movil.slnx
```

Actualmente apunta al proyecto real en:

```text
app-movil/app-movil/app-movil.csproj
```

Esto es importante porque, despues de la reorganizacion, el archivo `.csproj` quedo un nivel mas adentro. Antes la solucion buscaba:

```text
app-movil/app-movil.csproj
```

pero esa ruta ya no corresponde a la ubicacion actual.

## 2. Proyecto MAUI

El archivo principal del proyecto es:

```text
app-movil/app-movil/app-movil.csproj
```

Configuracion actual importante:

```xml
<TargetFrameworks>net10.0-android</TargetFrameworks>
<OutputType>Exe</OutputType>
<RootNamespace>app_movil</RootNamespace>
<UseMaui>true</UseMaui>
<SingleProject>true</SingleProject>
<ImplicitUsings>enable</ImplicitUsings>
<Nullable>enable</Nullable>
<MauiXamlInflator>SourceGen</MauiXamlInflator>
```

Esto significa:

- La app esta configurada actualmente para Android.
- Usa el modelo `SingleProject` de .NET MAUI.
- El namespace raiz del proyecto es `app_movil`.
- La app usa XAML.
- La generacion de XAML esta activa con `MauiXamlInflator=SourceGen`.
- La nulabilidad esta activa, por eso aparecen advertencias cuando eventos o parametros no declaran bien si aceptan `null`.

## 3. Dependencias instaladas

El proyecto usa estas dependencias principales:

```xml
<PackageReference Include="Microsoft.Maui.Controls" Version="$(MauiVersion)" />
<PackageReference Include="Microsoft.Extensions.Logging.Debug" Version="10.0.0" />
<PackageReference Include="UraniumUI.Icons.MaterialSymbols" Version="2.15.0" />
<PackageReference Include="UraniumUI.Material" Version="2.15.0" />
```

Funcionamiento:

- `Microsoft.Maui.Controls`: base de controles visuales MAUI.
- `Microsoft.Extensions.Logging.Debug`: logs en modo debug.
- `UraniumUI.Material`: componentes/estilos Material para MAUI.
- `UraniumUI.Icons.MaterialSymbols`: iconos Material Symbols.

## 4. Inicio de la aplicacion

El punto de configuracion de MAUI esta en:

```text
MauiProgram.cs
```

Actualmente registra:

```csharp
builder
    .UseMauiApp<App>()
    .UseUraniumUI()
    .UseUraniumUIMaterial()
    .ConfigureFonts(fonts =>
    {
        fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
        fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
        fonts.AddMaterialSymbolsFonts();
    });
```

Esto hace que:

- La clase `App` sea la aplicacion principal.
- UraniumUI quede habilitado.
- UraniumUI Material quede habilitado.
- Se registren las fuentes `OpenSans-Regular.ttf` y `OpenSans-Semibold.ttf`.
- Se registren los iconos Material Symbols.

En modo `DEBUG`, tambien se habilita:

```csharp
builder.Logging.AddDebug();
```

## 5. Clase App

Archivos:

```text
App.xaml
App.xaml.cs
```

`App.xaml` carga los diccionarios globales de recursos:

```xml
<ResourceDictionary Source="Resources/Styles/Colors.xaml" />
<ResourceDictionary Source="Resources/Styles/Styles.xaml" />
```

`App.xaml.cs` define el tema claro y crea la ventana principal:

```csharp
UserAppTheme = AppTheme.Light;
return new Window(new AppShell());
```

Funcionamiento:

- La app fuerza tema claro.
- La primera pantalla se administra mediante `AppShell`.
- Los colores y estilos globales estan disponibles en toda la app.

## 6. Navegacion con Shell

Archivos:

```text
AppShell.xaml
AppShell.xaml.cs
```

`AppShell.xaml` define el contenedor principal de navegacion:

```xml
<Shell
    x:Class="app_movil.AppShell"
    Shell.NavBarIsVisible="False">
```

Actualmente registra visualmente estas rutas:

```xml
<ShellContent
    Title="Welcome"
    ContentTemplate="{DataTemplate auth:Welcome}"
    Route="Welcome" />

<ShellContent
    Title="ForgotPassword"
    ContentTemplate="{DataTemplate auth:ForgotPassword}"
    Route="ForgotPassword"/>

<ShellContent
    Title="VerifyCode"
    ContentTemplate="{DataTemplate auth:VerifyCode}"
    Route="VerifyCode"/>
```

`AppShell.xaml.cs` registra rutas para navegacion programatica:

```csharp
Routing.RegisterRoute("ForgotPassword", typeof(Features.Auth.Views.ForgotPassword));
Routing.RegisterRoute("VerifyCode", typeof(Features.Auth.Views.VerifyCode));
Routing.RegisterRoute("NewPassword", typeof(Features.Auth.Views.NewPassword));
```

Funcionamiento actual:

- La app arranca en el Shell.
- La primera pantalla visible es `Welcome`.
- Se puede navegar a `ForgotPassword`.
- Desde `ForgotPassword` se puede navegar a `VerifyCode`.
- Desde `VerifyCode` se puede navegar a `NewPassword`.
- `NewPassword` esta registrada como ruta aunque no aparece como `ShellContent`.

## 7. Flujo de autenticacion actual

Las pantallas activas estan en:

```text
Features/Auth/Views
```

Pantallas actuales:

```text
Welcome.xaml
ForgotPassword.xaml
VerifyCode.xaml
NewPassword.xaml
```

Los archivos `.xaml.cs` fueron movidos fisicamente a:

```text
Features/Auth/ViewModels
```

pero siguen funcionando como code-behind porque conservan el namespace de las Views:

```csharp
namespace app_movil.Features.Auth.Views;
```

Esto permite que MAUI una correctamente cada XAML con su clase parcial.

Importante: aunque la carpeta se llama `ViewModels`, estos archivos todavia no son ViewModels reales. Siguen siendo code-behind porque heredan de `ContentPage` y contienen eventos de UI.

## 8. Pantalla Welcome

Archivos:

```text
Features/Auth/Views/Welcome.xaml
Features/Auth/ViewModels/Welcome.xaml.cs
```

Funcionamiento:

- Muestra una pantalla de inicio de sesion.
- Usa traducciones para textos como `Login`, `Email`, `Password` y `ForgotPassword`.
- Usa `InputField` reutilizable para correo y contrasena.
- Usa `PrimaryButton` para el boton de ingreso.
- El enlace "ForgotPassword" navega a la pantalla de recuperacion.

Evento principal:

```csharp
private async void OnForgotPasswordTapped(object? sender, TappedEventArgs e)
{
    await Navigation.PushAsync(new ForgotPassword());
}
```

Nota:

- Esta navegacion usa `Navigation.PushAsync`.
- El resto del flujo usa mas `Shell.Current.GoToAsync`.
- Funciona al compilar, pero a futuro conviene unificar la navegacion usando Shell.

## 9. Pantalla ForgotPassword

Archivos:

```text
Features/Auth/Views/ForgotPassword.xaml
Features/Auth/ViewModels/ForgotPassword.xaml.cs
```

Funcionamiento:

- Muestra formulario para ingresar correo.
- Usa `Entry` directamente para el correo.
- Usa `PrimaryButton` para enviar codigo.
- Usa traducciones: `ResetPassword`, `EnterEmail`, `Email`, `CodeVerif`, `SendCode`.

Evento principal:

```csharp
private async void OnSendCodeClicked(object? sender, EventArgs e)
{
    await Shell.Current.GoToAsync(nameof(VerifyCode));
}
```

Tambien existe:

```csharp
private async void OnBackTapped(object? sender, TappedEventArgs e)
{
    await Shell.Current.GoToAsync("..");
}
```

Nota:

- `OnBackTapped` esta preparado, pero en el XAML actual no se ve un control conectado a ese evento.

## 10. Pantalla VerifyCode

Archivos:

```text
Features/Auth/Views/VerifyCode.xaml
Features/Auth/ViewModels/VerifyCode.xaml.cs
```

Funcionamiento:

- Muestra instrucciones para ingresar codigo.
- Usa el componente reutilizable `CodeInput`.
- Usa `PrimaryButton` para continuar.
- Usa traducciones: `ResetPassword`, `CodeEmail`, `TransferCode`, `SendCode`.

Evento principal:

```csharp
private async void OnSendCodeClicked(object? sender, EventArgs e)
{
    await Shell.Current.GoToAsync(nameof(NewPassword));
}
```

## 11. Pantalla NewPassword

Archivos:

```text
Features/Auth/Views/NewPassword.xaml
Features/Auth/ViewModels/NewPassword.xaml.cs
```

Funcionamiento:

- Muestra pantalla para crear nueva contrasena.
- Usa `InputField` para la nueva contrasena.
- Usa `InputField` para confirmar contrasena.
- Ambos campos tienen `IsPassword="True"`.
- Usa `PrimaryButton` para restaurar.

Evento principal:

```csharp
private async void OnSendCodeClicked(object? sender, EventArgs e)
{
    await Navigation.PushAsync(new Welcome());
}
```

Nota:

- Esta pantalla vuelve a `Welcome` usando `Navigation.PushAsync`.
- A futuro conviene usar Shell tambien aqui, por ejemplo `Shell.Current.GoToAsync("//Welcome")` si se quiere volver al inicio limpiando el flujo.

## 12. Componentes reutilizables

Los componentes estan en:

```text
Components
```

### PrimaryButton

Archivos:

```text
Components/Buttons/PrimaryButton.xaml
Components/Buttons/PrimaryButton.xaml.cs
```

Namespace:

```csharp
app_movil.Components
```

Funcionamiento:

- Envuelve un `Button` de MAUI.
- Permite configurar texto con la propiedad `Text`.
- Permite usar `Command`.
- Permite usar `CommandParameter`.
- Expone evento `Clicked`.

Propiedades enlazables:

```csharp
Text
Command
CommandParameter
```

Se usa en:

- `Welcome.xaml`
- `ForgotPassword.xaml`
- `VerifyCode.xaml`
- `NewPassword.xaml`

### InputField

Archivos:

```text
Components/Inputs/InputField.xaml
Components/Inputs/InputField.xaml.cs
```

Namespace:

```csharp
app_movil.Components.Inputs
```

Funcionamiento:

- Componente reutilizable para entrada de texto.
- Muestra un label superior.
- Usa un `Entry` dentro de un `Border`.
- Permite texto bidireccional con `BindingMode.TwoWay`.
- Permite configurar teclado.
- Permite configurar si es campo de contrasena.

Propiedades enlazables:

```csharp
LabelText
Placeholder
Text
Keyboard
IsPassword
```

Se usa en:

- `Welcome.xaml`
- `NewPassword.xaml`

### CodeInput

Archivos:

```text
Components/Inputs/CodeInput.xaml
Components/Inputs/CodeInput.xaml.cs
```

Namespace:

```csharp
app_movil.Components.Inputs
```

Funcionamiento:

- Muestra seis campos `Entry`.
- Cada campo usa el estilo `CodeEntryStyle`.
- Cada campo acepta maximo un caracter.
- El teclado es numerico.

Se usa en:

- `VerifyCode.xaml`

### HeaderBar

Archivos:

```text
Components/Layout/HeaderBar.xaml
Components/Layout/HeaderBar.xaml.cs
```

Namespace:

```csharp
app_movil.Components
```

Funcionamiento:

- Componente de encabezado.
- Compila correctamente.
- Actualmente no se ve usado en las pantallas de autenticacion revisadas.

### BottomTabBar

Archivos:

```text
Components/Layout/BottomTabBar.xaml
Components/Layout/BottomTabBar.xaml.cs
```

Namespace:

```csharp
app_movil.Components.Layout
```

Funcionamiento:

- Componente de barra inferior.
- Expone evento:

```csharp
public event EventHandler<string> TabSelected;
```

- Al tocar una opcion, emite uno de estos valores:

```text
rutas
ubicacion
perfil
```

Eventos internos:

```csharp
OnRutasTapped
OnUbicacionTapped
OnPerfilTapped
```

Compila correctamente, pero no se ve integrado todavia en el flujo de autenticacion.

### RouteInfoCard

Archivos:

```text
Components/Cards/RouteInfoCard.xaml
Components/Cards/RouteInfoCard.xaml.cs
```

Namespace:

```csharp
app_movil.Components.Cards
```

Funcionamiento:

- Componente visual tipo tarjeta para informacion de ruta.
- Compila correctamente.
- Actualmente no se ve usado en las pantallas de autenticacion revisadas.

## 13. Recursos globales

Los recursos estan en:

```text
Resources
```

### Colores

Archivo:

```text
Resources/Styles/Colors.xaml
```

Define colores globales como:

```text
Primary
PrimaryDark
PrimaryLight
Background
CardBackground
TextPrimary
TextSecondary
TitleColor
InputPlaceholder
BorderColor
ButtonPrimary
White
Black
Gray100...Gray950
```

Estos colores son usados en XAML con:

```xml
{StaticResource Background}
{StaticResource TitleColor}
{StaticResource TextSecondary}
```

### Estilos

Archivo:

```text
Resources/Styles/Styles.xaml
```

Define estilos globales para controles MAUI:

```text
ActivityIndicator
IndicatorView
Border
BoxView
Button
CheckBox
DatePicker
Editor
Entry
ImageButton
Label
Picker
ProgressBar
RadioButton
RefreshView
SearchBar
SearchHandler
Shadow
Slider
SwipeItem
Switch
TimePicker
Page
Shell
NavigationPage
TabbedPage
```

Tambien define el estilo especial:

```xml
<Style x:Key="CodeEntryStyle" TargetType="Entry">
```

Ese estilo se usa en `CodeInput`.

### Fuentes

Archivos:

```text
Resources/Fonts/OpenSans-Regular.ttf
Resources/Fonts/OpenSans-Semibold.ttf
```

Registradas en `MauiProgram.cs` como:

```text
OpenSansRegular
OpenSansSemibold
```

### Icono y splash

Archivos:

```text
Resources/AppIcon/appicon.svg
Resources/AppIcon/appiconfg.svg
Resources/Splash/splash.svg
```

Registrados en el `.csproj`:

```xml
<MauiIcon Include="Resources\AppIcon\appicon.svg" ... />
<MauiSplashScreen Include="Resources\Splash\splash.svg" ... />
```

### Imagenes

Archivo actual:

```text
Resources/Images/dotnet_bot.png
```

Registrado como `MauiImage`.

### Raw assets

Archivo actual:

```text
Resources/Raw/AboutAssets.txt
```

Registrado como `MauiAsset`.

## 14. Traducciones e internacionalizacion

Archivos:

```text
Resources/Strings/AppStrings.es.resx
Resources/Strings/AppStrings.en.resx
Resources/Strings/AppStrings.fr.resx
Resources/Strings/AppStrings.pt.resx
```

Servicio:

```text
Core/Services/LocalizationService.cs
```

Extension XAML:

```text
Core/Extensions/TranslationExtension.cs
```

Funcionamiento:

- `LocalizationService` usa `ResourceManager`.
- Busca textos en `app_movil.Resources.Strings.AppStrings`.
- Si no encuentra una clave, devuelve la clave original.
- Permite cambiar idioma con:

```csharp
LocalizationService.SetLanguage("es");
LocalizationService.SetLanguage("en");
LocalizationService.SetLanguage("fr");
LocalizationService.SetLanguage("pt");
```

Uso desde XAML:

```xml
Text="{services:Translation Key=Login}"
```

Claves usadas actualmente:

```text
Welcome
Email
Password
Login
ForgotPassword
ResetPassword
SendCode
Enter
EnterEmail
CodeVerif
CodeEmail
CodeSec
TransferCode
VerifyCode
NewPasswordDescription
NewPasswordTitle
ConfirmPasswordTitle
Restore
```

Observacion:

- Las traducciones compilan.
- Algunos textos en los archivos se ven con caracteres mal codificados al leerlos desde consola, por ejemplo `ContraseÃ±a`. Conviene revisar la codificacion UTF-8 de los `.resx` y XAML para que los acentos se muestren correctamente.

## 15. Plataformas

El proyecto tiene carpetas de plataforma:

```text
Platforms/Android
Platforms/iOS
Platforms/MacCatalyst
Platforms/Windows
```

Pero el `.csproj` actual solo compila para:

```text
net10.0-android
```

Por eso la validacion realizada fue para Android.

### Android

Archivo:

```text
Platforms/Android/AndroidManifest.xml
```

Permisos actuales:

```xml
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.INTERNET" />
```

Esto permite:

- Consultar estado de red.
- Usar internet.

Tambien existen:

```text
Platforms/Android/MainActivity.cs
Platforms/Android/MainApplication.cs
Platforms/Android/Resources/values/colors.xml
```

## 16. Estado actual de compilacion

El proyecto MAUI compila con:

```powershell
cd dvlp-movil
dotnet build app-movil.slnx
```

Resultado actual:

```text
Build correcto
0 errores
64 advertencias
```

Advertencias principales:

- Nulabilidad en eventos como `Clicked` y `TabSelected`.
- Diferencias de nulabilidad en parametros `sender`.
- Advertencias CA1416/CA1418 de analisis de plataforma.
- Nulabilidad en `CreateWindow(IActivationState activationState)`.

Estas advertencias no rompen la compilacion.

## 17. Cambios realizados para que compile despues de reorganizar

### Ruta del proyecto en la solucion

Se cambio:

```text
app-movil/app-movil.csproj
```

por:

```text
app-movil/app-movil/app-movil.csproj
```

Archivo modificado:

```text
dvlp-movil/app-movil.slnx
```

### Namespace de InputField

Antes:

```csharp
namespace app_movil.Components;
```

Ahora:

```csharp
namespace app_movil.Components.Inputs;
```

Tambien se actualizo el XAML:

```xml
x:Class="app_movil.Components.Inputs.InputField"
```

Archivos:

```text
Components/Inputs/InputField.xaml
Components/Inputs/InputField.xaml.cs
```

### Uso de InputField en pantallas

Antes:

```xml
<components:InputField />
```

Ahora:

```xml
<inputs:InputField />
```

Pantallas modificadas:

```text
Features/Auth/Views/Welcome.xaml
Features/Auth/Views/NewPassword.xaml
```

### Campos de contrasena

En `NewPassword.xaml` se corrigio:

```xml
Keyboard="Password"
```

por:

```xml
IsPassword="True"
```

Porque `Password` no es un valor valido para `Keyboard` en MAUI.

## 18. Que funciona hasta ahora

Actualmente funciona:

- La solucion MAUI apunta al proyecto correcto.
- El proyecto compila.
- La app arranca desde `App`.
- La ventana principal carga `AppShell`.
- `AppShell` controla la navegacion principal.
- Las rutas de autenticacion estan registradas.
- La pantalla `Welcome` existe y compila.
- La pantalla `ForgotPassword` existe y compila.
- La pantalla `VerifyCode` existe y compila.
- La pantalla `NewPassword` existe y compila.
- Los componentes `PrimaryButton`, `InputField` y `CodeInput` compilan.
- Los recursos globales de colores y estilos cargan desde `App.xaml`.
- Las fuentes OpenSans estan registradas.
- UraniumUI esta registrado.
- Los iconos Material Symbols estan registrados.
- Los archivos `.resx` de idiomas estan conectados mediante `LocalizationService`.
- La extension `{services:Translation ...}` funciona en XAML.
- Android tiene permisos de internet y estado de red.

## 19. Lo que esta pendiente o conviene mejorar

### Reorganizar code-behind y ViewModels

Los archivos en:

```text
Features/Auth/ViewModels
```

siguen siendo code-behind de las Views. Funcionan porque mantienen:

```csharp
namespace app_movil.Features.Auth.Views;
```

pero arquitectonicamente no son ViewModels reales.

Opciones recomendadas:

- Mover los `.xaml.cs` de regreso a `Features/Auth/Views`.
- O crear ViewModels reales, por ejemplo `WelcomeViewModel`, `ForgotPasswordViewModel`, etc.

### Unificar navegacion

Actualmente se mezclan:

```csharp
Navigation.PushAsync(...)
Shell.Current.GoToAsync(...)
```

Recomendacion:

- Usar Shell para todo el flujo.
- Evitar mezclar navegacion tradicional con Shell.

### Corregir codificacion de textos

Hay textos que aparecen como:

```text
ContraseÃ±a
Iniciar sesiÃ³n
Â¿OlvidÃ³ la contraseÃ±a?
```

Recomendacion:

- Guardar XAML y `.resx` en UTF-8 correcto.
- Revisar textos visibles con acentos.

### Reducir advertencias de nulabilidad

Ejemplos:

```csharp
public event EventHandler Clicked;
public event EventHandler<string> TabSelected;
```

Podrian declararse como nullable:

```csharp
public event EventHandler? Clicked;
public event EventHandler<string>? TabSelected;
```

Tambien se pueden ajustar parametros:

```csharp
private void MainButton_Clicked(object? sender, EventArgs e)
```

### Revisar plataformas

Aunque hay carpetas para iOS, MacCatalyst y Windows, el proyecto actual solo compila Android:

```xml
<TargetFrameworks>net10.0-android</TargetFrameworks>
```

Si se desea compilar para Windows/iOS/MacCatalyst, habria que volver a agregar esos frameworks al `.csproj`.

## 20. Resumen final

El proyecto MAUI esta funcionando a nivel de compilacion y estructura base. La parte movil tiene configurado:

- Proyecto MAUI Android.
- Shell como sistema de navegacion.
- Flujo inicial de autenticacion.
- Componentes reutilizables.
- Recursos globales.
- Traducciones por `.resx`.
- UraniumUI y Material Symbols.

Lo mas importante ya quedo corregido: la solucion apunta al `.csproj` correcto y los componentes reorganizados tienen namespaces coherentes con su ubicacion.

El siguiente paso tecnico recomendable es ordenar la arquitectura de `Views`/`ViewModels`, unificar la navegacion con Shell y corregir la codificacion de textos con acentos.
