import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "node:net";
import { availablePort, selectLanAddress } from "./start-lan.mjs";

const interfaces = {
  Ethernet: [{ address: "192.168.56.1", family: "IPv4", internal: false }],
  WiFi: [{ address: "192.168.1.18", family: "IPv4", internal: false }],
  Loopback: [{ address: "127.0.0.1", family: "IPv4", internal: true }],
};

test("uses the active route when no LAN IP is configured", () => {
  assert.equal(selectLanAddress(undefined, interfaces, "192.168.1.18"), "192.168.1.18");
});

test("replaces a stale configured IP with the active route", () => {
  assert.equal(selectLanAddress("192.168.100.211", interfaces, "192.168.1.18"), "192.168.1.18");
});

test("respects a configured IP belonging to a local network interface", () => {
  assert.equal(selectLanAddress("192.168.56.1", interfaces, "192.168.1.18"), "192.168.56.1");
});

test("rejects loopback or an unavailable network instead of advertising an invalid IP", () => {
  assert.throws(() => selectLanAddress("127.0.0.1", interfaces, "127.0.0.1"), /LAN activa/);
  assert.throws(() => selectLanAddress(undefined, {}, "0.0.0.0"), /LAN activa/);
});

test("skips an occupied Metro port without requiring an interactive prompt", async () => {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "0.0.0.0", resolve);
  });
  try {
    const port = server.address().port;
    assert.ok(await availablePort(port) > port);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
