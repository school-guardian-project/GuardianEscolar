import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const tunnels = [
  { key: "EXPO_PUBLIC_API_URL", container: "sg-cloudflared", path: "/api/v1/auth/profile", status: 401 },
  { key: "EXPO_PUBLIC_FORGOT_INFORMATION_API_URL", container: "sg-cloudflared-forgot", path: "/api/v1/password/forgot", status: 405 },
];

export function latestTunnel(logs) {
  const matches = [...logs.matchAll(/https:\/\/[a-z0-9-]+\.trycloudflare\.com\b/g)];
  if (!matches.length) throw new Error("No se encontro la URL del tunel de Cloudflare.");
  return matches.at(-1)[0];
}

export function replaceEnvValue(text, key, value) {
  const pattern = new RegExp(`^${key}=.*$`, "gm");
  if (pattern.test(text)) return text.replace(pattern, () => `${key}=${value}`);
  return `${text}${text.endsWith("\n") || !text ? "" : "\n"}${key}=${value}\n`;
}

export async function syncTunnels({ envPath, ifConfigured = false, logsFor, fetchUrl = fetch }) {
  let text = readFileSync(envPath, "utf8");
  if (ifConfigured && !/^EXPO_PUBLIC_(?:API_URL|FORGOT_INFORMATION_API_URL)=https:\/\/[a-z0-9-]+\.trycloudflare\.com\/?\s*$/m.test(text)) {
    return false;
  }
  for (const tunnel of tunnels) {
    const url = latestTunnel(logsFor(tunnel.container));
    const response = await fetchUrl(`${url}${tunnel.path}`, { signal: AbortSignal.timeout(15000) });
    if (response.status !== tunnel.status) {
      throw new Error(`${tunnel.container} no responde correctamente: HTTP ${response.status}.`);
    }
    text = replaceEnvValue(text, tunnel.key, url);
  }
  writeFileSync(envPath, text, "utf8");
  return true;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const updated = await syncTunnels({
      envPath: fileURLToPath(new URL("../.env", import.meta.url)),
      ifConfigured: process.argv.includes("--if-configured"),
      logsFor(container) {
        const result = spawnSync("docker", ["logs", "--tail", "500", container], { encoding: "utf8" });
        if (result.error || result.status !== 0) {
          throw new Error(`No se pudieron leer los logs de ${container}. Comprueba que Docker y el contenedor esten encendidos.`);
        }
        return `${result.stdout}\n${result.stderr}`;
      },
    });
    console.log(updated ? "URLs de las API sincronizadas y verificadas." : "Configuracion sin tuneles temporales; URLs conservadas.");
  } catch (error) {
    console.error(`No se pudo preparar la conexion de Expo: ${error.message}`);
    process.exitCode = 1;
  }
}
