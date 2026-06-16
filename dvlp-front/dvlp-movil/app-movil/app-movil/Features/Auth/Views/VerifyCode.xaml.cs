namespace app_movil.Features.Auth.Views;

public partial class VerifyCode : ContentPage
{
	public VerifyCode()
	{
		InitializeComponent();
	}
    private async void OnSendCodeClicked(object? sender, EventArgs e)
    {
        await Navigation.PushAsync(new NewPassword());
    }

}



















