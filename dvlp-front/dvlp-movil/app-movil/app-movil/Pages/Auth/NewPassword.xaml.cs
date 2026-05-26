namespace app_movil.Pages.Auth;

public partial class NewPassword : ContentPage
{
	public NewPassword()
	{
		InitializeComponent();
	}
    private async void OnSendCodeClicked(object? sender, EventArgs e)
    {
        await Navigation.PushAsync(new Welcome());
    }

}