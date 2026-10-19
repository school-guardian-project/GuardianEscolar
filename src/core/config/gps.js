export const GPS_CONFIG = {
  baseUrl: "https://52-15-190-40.sslip.io",
  imei: "355468590730586",
  pollingIntervalMs: 5000,  // Cambiado de 10000ms (10s) a 5000ms (5s) para mayor frecuencia
};

// Para Android físico o Expo Go, cambiar baseUrl por la IP LAN del equipo
// donde corre el backend, por ejemplo: http://192.168.1.X:8084
// Producción (AWS EC2): https://3-15-21-147.sslip.io (Kong/Caddy en el EC2)
