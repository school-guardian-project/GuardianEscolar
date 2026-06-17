namespace app_movil.Features.Auth.Views;

public partial class ForgotPassword : ContentPage
{
    public ForgotPassword()
    {
        InitializeComponent();
    }

    private async void OnBackTapped(object? sender, TappedEventArgs e)
    {
        await Shell.Current.GoToAsync("..");
    }

    private async void OnSendCodeClicked(object? sender, EventArgs e)
    {
        await Shell.Current.GoToAsync(nameof(VerifyCode));
    }
}