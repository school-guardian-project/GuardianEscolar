// [SIMULATE-API-BACKEND] Configuración compartida — unifica móvil y web

function getApiBaseUrl(platform = 'web') {
  if (platform === 'movil') {
    // Lógica para móvil (Expo)
    try {
      const Constants = require('expo-constants');
      const hostUri = Constants.expoConfig?.hostUri || Constants.manifest?.hostUri;
      if (hostUri) {
        const host = hostUri.split(':')[0];
        if (host && host !== 'localhost' && host !== '127.0.0.1') {
          return `http://${host}:3000`;
        }
      }
    } catch {}
  } else {
    // Lógica para web (Angular)
    try {
      const envUrl = window?.__env?.NG_APP_API_URL;
      if (envUrl) return envUrl;
      const host = window?.location?.hostname;
      if (host && host !== 'localhost' && host !== '127.0.0.1') {
        return `http://${host}:3000`;
      }
    } catch {}
  }
  return 'http://localhost:3000';
}

export const createConfig = (platform = 'web') => ({
  baseUrl: getApiBaseUrl(platform),
  enabled: true,
  timeoutMs: 8000,
  cacheTtlMs: 60_000,
});
