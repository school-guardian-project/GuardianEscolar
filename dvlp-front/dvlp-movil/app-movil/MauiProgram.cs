using Microsoft.Extensions.Logging;
using UraniumUI;
using UraniumUI.Material;
using SkiaSharp.Views.Maui;

namespace app_movil;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();

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

        // Registrar handlers de SkiaSharp automáticamente
        builder.UseSkiaSharp();

#if DEBUG
        builder.Logging.AddDebug();
#endif

        return builder.Build();
    }
}}