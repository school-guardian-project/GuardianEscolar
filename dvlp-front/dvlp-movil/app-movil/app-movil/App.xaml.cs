namespace app_movil;

public partial class App : Application
{
    public App()
    {
        InitializeComponent();
        UserAppTheme = AppTheme.Light;
        MainPage = new NavigationPage(new Pages.Auth.Welcome());
    }
}