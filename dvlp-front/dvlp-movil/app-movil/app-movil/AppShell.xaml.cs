namespace app_movil
{
    public partial class AppShell : Shell
    {
        public AppShell()
        {
            InitializeComponent();
            Routing.RegisterRoute("ForgotPassword", typeof(Pages.Auth.ForgotPassword));
        }
    }
}