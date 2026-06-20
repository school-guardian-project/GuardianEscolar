namespace app_movil.Features.Auth.Views;

public partial class VerifyCode : ContentPage
{
	public VerifyCode()
	{
		InitializeComponent();
	}
	private async void OnSendCodeClicked(object? sender, EventArgs e)
	{
		// Usar navegación de Shell para evitar NullReference si Navigation es nulo
		await Shell.Current.GoToAsync(nameof(NewPassword));
	}

}







