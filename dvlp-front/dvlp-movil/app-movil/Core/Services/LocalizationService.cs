// Dice que esta clase pertenece a la carpeta Services
using System.Globalization;
using System.Resources;

namespace app_movil.Services;

// static = no necesitas crear un objeto para usarla, la llamas directo
public static class LocalizationService
{
    // ResourceManager es el que lee los archivos .resx
    // Le decimos dónde están: "app_movil.Resources.Strings.AppStrings"
    private static ResourceManager _resourceManager =
        new ResourceManager("app_movil.Resources.Strings.AppStrings",
            typeof(LocalizationService).Assembly);

    // Get("Login") → busca la clave "Login" en el idioma actual
    // y devuelve la traducción. Si no encuentra nada, devuelve la clave
    public static string Get(string key)
    {
        return _resourceManager.GetString(key, CultureInfo.CurrentUICulture) ?? key;
    }

    // SetLanguage("en") → cambia el idioma de toda la app a inglés
    // SetLanguage("es") → cambia a español
    // SetLanguage("fr") → cambia a francés
    // SetLanguage("pt") → cambia a portugués
    public static void SetLanguage(string languageCode)
    {
        CultureInfo.CurrentUICulture = new CultureInfo(languageCode);
        CultureInfo.CurrentCulture = new CultureInfo(languageCode);
    }
}