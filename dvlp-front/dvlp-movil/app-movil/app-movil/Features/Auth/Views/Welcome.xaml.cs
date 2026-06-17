namespace app_movil.Features.Auth.Views;

public partial class Welcome : ContentPage
{
    public Welcome()
    {
        InitializeComponent();
    }
    private async void OnForgotPasswordTapped(object? sender, TappedEventArgs e)
    {
        await Navigation.PushAsync(new ForgotPassword());
    }


}