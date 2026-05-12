namespace app_movil.Pages.Auth;

public partial class Welcome : ContentPage
{
    public Welcome()
    {
        InitializeComponent();
    }
    private async void OnForgotPasswordTapped(object? sender, TappedEventArgs e)
    {
        await Shell.Current.GoToAsync("//ForgotPassword");
    }


}