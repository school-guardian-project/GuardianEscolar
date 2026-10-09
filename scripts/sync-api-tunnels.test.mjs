import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { latestTunnel, replaceEnvValue, syncTunnels } from "./sync-api-tunnels.mjs";

test("selects the latest tunnel after container restarts", () => {
  assert.equal(latestTunnel("https://old.trycloudflare.com\nhttps://new.trycloudflare.com"), "https://new.trycloudflare.com");
  assert.throws(() => latestTunnel("No tunnel available"));
});

test("updates only the public API variable and appends missing ones", () => {
  assert.equal(replaceEnvValue("OTHER=value\nEXPO_PUBLIC_API_URL=old\n", "EXPO_PUBLIC_API_URL", "new"),
    "OTHER=value\nEXPO_PUBLIC_API_URL=new\n");
  assert.equal(replaceEnvValue("OTHER=value", "EXPO_PUBLIC_API_URL", "new"),
    "OTHER=value\nEXPO_PUBLIC_API_URL=new\n");
});

test("validates both services before saving, preserves LAN URLs, and exposes failures", async () => {
  const folder = mkdtempSync(join(tmpdir(), "expo-tunnel-test-"));
  const envPath = join(folder, ".env");
  const original = "OTHER=value\nEXPO_PUBLIC_API_URL=https://old.trycloudflare.com\n";
  const logsFor = container => `https://${container}.trycloudflare.com`;
  try {
    writeFileSync(envPath, original);
    const requests = [];
    await syncTunnels({ envPath, logsFor, fetchUrl: async url => {
      requests.push(url);
      return { status: url.endsWith("/profile") ? 401 : 405 };
    } });
    assert.equal(requests.length, 2);
    assert.match(readFileSync(envPath, "utf8"), /EXPO_PUBLIC_FORGOT_INFORMATION_API_URL=https:\/\/sg-cloudflared-forgot/);
    writeFileSync(envPath, original);
    await assert.rejects(syncTunnels({ envPath, logsFor, fetchUrl: async () => ({ status: 502 }) }), /HTTP 502/);
    assert.equal(readFileSync(envPath, "utf8"), original);
    writeFileSync(envPath, "EXPO_PUBLIC_API_URL=http://192.168.1.2:8000\n");
    assert.equal(await syncTunnels({ envPath, ifConfigured: true, logsFor: () => {
      throw new Error("Docker must not be used for LAN URLs");
    } }), false);
  } finally {
    rmSync(folder, { recursive: true });
  }
});
