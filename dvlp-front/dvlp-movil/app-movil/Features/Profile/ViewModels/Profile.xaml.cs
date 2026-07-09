using Microsoft.Maui.Controls;

namespace app_movil.Features.Profile.Views
{
    public partial class Profile : ContentPage
    {
        public Profile()
        {
            InitializeComponent();
        }

        private async void OnTabSelected(object sender, string tab)
        {
            if (tab == "routes")
                await Shell.Current.GoToAsync("//MainPage");
            else if (tab == "location")
                await Shell.Current.GoToAsync("//MainPage");
            else if (tab == "profile")
                await Shell.Current.GoToAsync(nameof(Profile));
        }
    }
}