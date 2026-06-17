// Importa herramientas de idioma/cultura
using System.Globalization;
using app_movil.Services;

namespace app_movil.Services;

// ContentProperty = le dice al XAML cuál es la propiedad principal
// IMarkupExtension<string> = permite usarlo directo en XAML con {}
[ContentProperty(nameof(Key))]
public class TranslationExtension : IMarkupExtension<string>
{
    // Key = la clave que buscas, ej: "Login", "Welcome"
    public string Key { get; set; } = string.Empty;

    // ProvideValue = cuando el XAML encuentra {services:Translation Key=Login}
    // llama este método y devuelve la traducción
    public string ProvideValue(IServiceProvider serviceProvider)
    {
        return LocalizationService.Get(Key); // busca "Login" en el idioma actual
    }

    // Esta es la versión genérica requerida por la interfaz
    object IMarkupExtension.ProvideValue(IServiceProvider serviceProvider)
    {
        return ProvideValue(serviceProvider);
    }
}