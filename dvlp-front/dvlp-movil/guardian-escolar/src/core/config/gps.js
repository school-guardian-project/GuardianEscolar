import Constants from "expo-constants";

// La URL del backend viene de EXPO_PUBLIC_API_URL. El IMEI no va en el código ni en una
// variable EXPO_PUBLIC_: app.config.js lo toma de GPS_IMEI (.env / EAS) y lo pasa por extra.
export const GPS_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL,
  imei: Constants.expoConfig?.extra?.gpsImei,
  pollingIntervalMs: 5000,  // Cambiado de 10000ms (10s) a 5000ms (5s) para mayor frecuencia
};
