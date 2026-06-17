namespace app_movil.Components.Layout;

public partial class BottomTabBar : ContentView
{
    // Esto es como un "aviso" que le manda al padre
    // diciéndole "oye, tocaron el tab X"
    public event EventHandler<string> TabSelected;

    public BottomTabBar()
    {
        InitializeComponent();
    }

    // Se ejecuta cuando tocan "Rutas"
    private void OnRutasTapped(object sender, TappedEventArgs e)
    {
        TabSelected?.Invoke(this, "rutas");
    }

    // Se ejecuta cuando tocan "Ubicación"
    private void OnUbicacionTapped(object sender, TappedEventArgs e)
    {
        TabSelected?.Invoke(this, "ubicacion");
    }

    // Se ejecuta cuando tocan "Perfil"
    private void OnPerfilTapped(object sender, TappedEventArgs e)
    {
        TabSelected?.Invoke(this, "perfil");
    }
}