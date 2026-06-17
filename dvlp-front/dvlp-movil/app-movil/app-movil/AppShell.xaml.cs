namespace app_movil
{
    public partial class AppShell : Shell
    {
        public AppShell()
        {
            InitializeComponent();
            // Registrar rutas para navegación mediante Shell
            Routing.RegisterRoute("ForgotPassword", typeof(Features.Auth.Views.ForgotPassword));
            Routing.RegisterRoute("VerifyCode", typeof(Features.Auth.Views.VerifyCode));
            Routing.RegisterRoute("NewPassword", typeof(Features.Auth.Views.NewPassword));
        }
    }
}
