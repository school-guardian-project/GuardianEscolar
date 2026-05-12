using app_movil.Pages.Auth;
namespace app_movil;

public partial class App : Application
{
    public App()
    {
        InitializeComponent();
        UserAppTheme = AppTheme.Light;
        MainPage = new AppShell();
    }
}