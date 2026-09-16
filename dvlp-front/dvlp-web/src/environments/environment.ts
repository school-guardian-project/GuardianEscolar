// [MOCK-API] Simulación temporal Cliente -> json-server -> DB. Para volver a backend: apiUrl:'http://localhost:8080'
// .env.example: NG_APP_API_URL=http://localhost:3000 — si existe, úsalo; si no, autodetecta host
function getEnvApiUrl(): string {
  const envUrl = (() => { try { return (window as any)?.__env?.NG_APP_API_URL; } catch { return undefined; } })();
  if (envUrl) return envUrl;
  try {
    const host = typeof window !== 'undefined' ? window.location.hostname : '';
    if (host && host !== 'localhost' && host !== '127.0.0.1') return `http://${host}:3000`;
  } catch {}
  return 'http://localhost:3000';
}
export const environment = {
    apiUrl: getEnvApiUrl()
};
