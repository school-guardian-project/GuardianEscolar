using Mapsui;
using Mapsui.Projections;
using Mapsui.Tiling;

namespace app_movil.Features.Home.Views;

public partial class MainPage : ContentPage
{
    public MainPage()
    {
        InitializeComponent();
        LoadMap();
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
    private void LoadMap()
    {
        var map = new Mapsui.Map();

        map.Widgets.Clear();
        map.Layers.Add(OpenStreetMap.CreateTileLayer());

        RouteMap.Map = map;

        // Límites aproximados de Colombia
        var (minX, minY) = SphericalMercator.FromLonLat(-81.85, -4.23);
        var (maxX, maxY) = SphericalMercator.FromLonLat(-66.85, 13.51);

        var bbox = new MRect(minX, minY, maxX, maxY);

        map.Navigator.ZoomToBox(bbox);

    }
}