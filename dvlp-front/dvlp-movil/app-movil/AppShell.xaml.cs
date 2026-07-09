using Microsoft.Maui.Controls;
using app_movil.Features.Auth.Views;
using app_movil.Features.Profile.Views;

namespace app_movil;

public partial class AppShell : Microsoft.Maui.Controls.Shell
{
    public AppShell()
    {
        InitializeComponent();

        Routing.RegisterRoute(nameof(ForgotPassword), typeof(ForgotPassword));
        Routing.RegisterRoute(nameof(VerifyCode), typeof(VerifyCode));
        Routing.RegisterRoute(nameof(NewPassword), typeof(NewPassword));
        Routing.RegisterRoute(nameof(Profile), typeof(Profile));
    }
}}