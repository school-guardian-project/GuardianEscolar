using app_movil.Features.Home.Views;

namespace app_movil.Features.Auth.Views;

public partial class Welcome : ContentPage
{
    public Welcome()
    {
        InitializeComponent();
    }
    private async void OnForgotPasswordTapped(object? sender, TappedEventArgs e)
    {
        await Shell.Current.GoToAsync(nameof(ForgotPassword));
    }

    private async void OnSendCodeClicked(object? sender, EventArgs e)
    {
        await Shell.Current.GoToAsync("//MainPage");
    }
}