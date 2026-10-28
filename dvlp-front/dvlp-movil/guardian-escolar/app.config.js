// app.config.js
//
// Existe porque app.json es un archivo estático y no puede leer .env.
// Dos valores tienen que salir de .env (local) o de EAS (builds), nunca de git:
//
// - La API key de Google Maps: se inyecta en android.config.googleMaps.apiKey, que es
//   de donde expo prebuild saca el <meta-data com.google.android.geo.API_KEY> del manifest.
// - El IMEI del GPS (GPS_IMEI): no lleva prefijo EXPO_PUBLIC_, así no se incrusta en el
//   bundle de JS ni se imprime en los logs del build. Llega a la app por extra.gpsImei.
//
// Expo pasa el contenido de app.json como `config`, así que acá se conserva todo
// y solo se agregan esos dos valores.

module.exports = ({ config }) => {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  const withExtra = {
    ...config,
    extra: {
      ...config.extra,
      gpsImei: process.env.EXPO_PUBLIC_GPS_IMEI,
    },
  };

  // Sin key no se toca el mapa: los entornos que no la definan siguen
  // compilando (el mapa no cargaría, nada más).
  if (!apiKey) {
    return withExtra;
  }

  return {
    ...withExtra,
    android: {
      ...withExtra.android,
      config: {
        ...withExtra.android?.config,
        googleMaps: { apiKey },
      },
    },
  };
};
