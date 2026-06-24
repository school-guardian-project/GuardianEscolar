using Mapsui.Tiling;
using Mapsui;
namespace app_movil.Features.Home.Views;

public partial class MainPage : ContentPage
{
	public MainPage()
	{
		InitializeComponent();
		LoadMap();
	}

	private void LoadMap() 
	{
		var map = new Mapsui.Map();
		map.Layers.Add(OpenStreetMap.CreateTileLayer());
		RouteMap.Map = map;
	}
}