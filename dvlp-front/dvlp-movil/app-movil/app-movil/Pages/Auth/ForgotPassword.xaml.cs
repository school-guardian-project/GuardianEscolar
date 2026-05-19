namespace app_movil.Pages.Auth;

public partial class ForgotPassword : ContentPage
{
    public ForgotPassword()
    {
        InitializeComponent();
    }

    private async void OnBackTapped(object? sender, TappedEventArgs e)
    {
        await Navigation.PopAsync();
    }

    private async void OnSendCodeClicked(object? sender, EventArgs e)
    {
        await Navigation.PushAsync(new VerifyCode());
    }
}