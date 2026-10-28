import test from "node:test";
import assert from "node:assert/strict";
import { normalizeStops, normalizeGeometry, toValidCoordinate } from "./routeMapData.js";

test("stops retain names and addresses and sort numerically by route order", () => {
  const result = normalizeStops({ stops: [
    { id: "b", name: "School", address: "School street", orderSequence: "10", latitude: "2.9", longitude: "-75.2" },
    { id: "a", name: "Home", address: "Home street", orderSequence: "2", latitude: 3, longitude: -75 },
  ] });
  assert.deepEqual(result.map(stop => stop.id), ["a", "b"]);
  assert.equal(result[1].address, "School street");
  assert.equal(result[1].latitude, 2.9);
});

test("invalid coordinates never become fake zero markers, while real zero and boundaries remain valid", () => {
  for (const invalid of [null, undefined, "", " ", "bad", Infinity]) {
    assert.equal(toValidCoordinate({ latitude: invalid, longitude: -75 }), null);
    assert.equal(toValidCoordinate({ latitude: 3, longitude: invalid }), null);
  }
  for (const coordinate of [{ latitude: 91, longitude: 0 }, { latitude: 0, longitude: -181 }])
    assert.equal(toValidCoordinate(coordinate), null);
  assert.deepEqual(toValidCoordinate({ latitude: 0, longitude: 0 }), { latitude: 0, longitude: 0 });
  assert.deepEqual(toValidCoordinate({ latitude: -90, longitude: 180 }), { latitude: -90, longitude: 180 });
});

test("empty, malformed and partially located routes are safe for native maps", () => {
  assert.deepEqual(normalizeStops(null), []);
  assert.deepEqual(normalizeStops({ stops: {} }), []);
  assert.equal(normalizeStops({ stops: [
    null, { latitude: null, longitude: 1 }, { latitude: 2, longitude: 3 },
  ] }).length, 1);
});

test("geometry accepts current camelCase and legacy PascalCase point fields", () => {
  const expected = [{ latitude: 2.9, longitude: -75.2 }];
  assert.deepEqual(normalizeGeometry({ geometry: { points: [{ latitude: 2.9, longitude: -75.2 }] } }), expected);
  assert.deepEqual(normalizeGeometry({ geometry: { Points: [{ Latitude: 2.9, Longitude: -75.2 }] } }), expected);
  assert.deepEqual(normalizeGeometry({ geometry: { points: [{ latitude: null, longitude: 1 }] } }), []);
});
