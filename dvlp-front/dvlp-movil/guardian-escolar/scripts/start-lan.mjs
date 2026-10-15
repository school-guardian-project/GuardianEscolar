import { spawn } from "node:child_process";
import { createSocket } from "node:dgram";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { createServer } from "node:net";
import { networkInterfaces } from "node:os";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

export function selectLanAddress(configured, interfaces, routeAddress) {
  const addresses = Object.values(interfaces).flat().filter(
    (entry) => entry && entry.family === "IPv4" && !entry.internal
  ).map((entry) => entry.address);
  if (configured && addresses.includes(configured)) return configured;
  if (!addresses.includes(routeAddress)) {
    throw new Error("No se encontro una conexion LAN activa. Comprueba tu Wi-Fi o Ethernet.");
  }
  return routeAddress;
}

function defaultRouteAddress() {
  return new Promise((resolveAddress, reject) => {
    const socket = createSocket("udp4");
    socket.once("error", (error) => {
      socket.close();
      reject(error);
    });
    // Connecting UDP resolves the local route without sending any packets.
    socket.connect(53, "1.1.1.1", () => {
      const address = socket.address().address;
      socket.close();
      resolveAddress(address);
    });
  });
}

export async function availablePort(firstPort = 8081) {
  for (let port = firstPort; port <= 65535; port++) {
    let free = true;
    for (const host of [undefined, "0.0.0.0", "localhost"]) {
      free = await new Promise((resolveFree, reject) => {
        const server = createServer();
        server.once("error", (error) => {
          if (error.code === "EADDRINUSE" || error.code === "EACCES") resolveFree(false);
          else reject(error);
        });
        server.listen(port, host, () => server.close(() => resolveFree(true)));
      });
      if (!free) break;
    }
    if (free) return port;
  }
  throw new Error("No hay un puerto disponible para Metro.");
}

async function startLan() {
  const envPath = resolve(projectRoot, ".env");
  const fileEnv = existsSync(envPath) ? parseEnv(readFileSync(envPath, "utf8")) : {};
  const configured = process.env.EXPO_LAN_IP || fileEnv.EXPO_LAN_IP;
  const address = selectLanAddress(configured, networkInterfaces(), await defaultRouteAddress());
  if (configured && configured !== address) {
    console.warn(`EXPO_LAN_IP=${configured} no pertenece a este equipo; se usara ${address}.`);
  }
  console.log(`Iniciando Expo Go en LAN: ${address}`);
  const args = process.argv.slice(2);
  if (!args.some((arg) => arg === "--port" || arg.startsWith("--port="))) {
    const port = await availablePort();
    if (port !== 8081) console.warn(`El puerto 8081 esta ocupado; Metro usara ${port}.`);
    args.push("--port", String(port));
  }

  const require = createRequire(import.meta.url);
  const child = spawn(process.execPath, [
    require.resolve("expo/bin/cli"),
    "start", "--lan", "--go", "--scheme", "exp", "--clear",
    ...args,
  ], {
    cwd: projectRoot,
    env: { ...process.env, REACT_NATIVE_PACKAGER_HOSTNAME: address },
    stdio: "inherit",
  });
  child.on("error", (error) => {
    console.error(`No se pudo iniciar Expo: ${error.message}`);
    process.exitCode = 1;
  });
  child.on("exit", (code, signal) => {
    process.exitCode = code ?? (signal === "SIGINT" ? 0 : 1);
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  startLan().catch((error) => {
    console.error(`No se pudo iniciar Expo en LAN: ${error.message}`);
    process.exitCode = 1;
  });
}
