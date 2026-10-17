// app.config.js
//
// Existe por un único motivo: app.json es un archivo estático y no puede leer .env.
// La API key de Google Maps sí tiene que salir de .env (así no se versiona en git, y
// el mismo valor que viaja al build queda disponible para el resto del proyecto).
//
// Expo pasa el contenido de app.json como `config`, así que acá se conserva todo
// y solo se inyecta android.config.googleMaps.apiKey, que es de donde
// expo prebuild saca el <meta-data com.google.android.geo.API_KEY> del manifest.

module.exports = ({ config }) => {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Sin key no se toca nada: el config queda igual que app.json y los entornos
  // que no la definan siguen compilando (el mapa no cargaría, nada más).
  if (!apiKey) {
    return config;
  }

  return {
    ...config,
    android: {
      ...config.android,
      config: {
        ...config.android?.config,
        googleMaps: { apiKey },
      },
    },
  };
};
