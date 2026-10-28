import test from "node:test";
import assert from "node:assert/strict";
import { normalizeTripStatus, localTripState } from "./tripStatus.js";

test("camelCase payload with numeric status enables the start button", () => {
  const trip = normalizeTripStatus({ status: 1, canStart: true, canEnd: false, tripId: "t" });
  assert.equal(trip.canStart, true);
  assert.equal(localTripState(trip), "ready_to_start");
});

test("PascalCase payload with text status still works", () => {
  const trip = normalizeTripStatus({ Status: "InProgress", CanEnd: true });
  assert.equal(localTripState(trip), "active");
  assert.equal(trip.canEnd, true);
});

test("ended and idle states", () => {
  assert.equal(localTripState(normalizeTripStatus({ status: 4 })), "ended");
  assert.equal(localTripState(normalizeTripStatus({ status: 0 })), "idle");
  assert.equal(normalizeTripStatus(null), null);
});
