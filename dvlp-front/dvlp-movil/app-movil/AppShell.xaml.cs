using app_movil.Features.Auth.Views;
using app_movil.Features.Home.Views;
namespace app_movil;

public partial class AppShell : Shell
{
    public AppShell()
    {
        InitializeComponent();

        Routing.RegisterRoute(nameof(ForgotPassword), typeof(ForgotPassword));
        Routing.RegisterRoute(nameof(VerifyCode), typeof(VerifyCode));
        Routing.RegisterRoute(nameof(NewPassword), typeof(NewPassword));
        Routing.RegisterRoute(nameof(Profile), typeof(Profile));
    }
}